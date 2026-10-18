import logging
import threading
import time

from psycopg.types.json import Jsonb

from app.db import pool
from app.structure import structure_recipe
from app.transcribe import get_transcript, unload_model

log = logging.getLogger("worker")
logging.basicConfig(level=logging.INFO)


def _claim_job():
    with pool.connection() as conn:
        return conn.execute("""
            UPDATE jobs SET status = 'processing', updated_at = now()
            WHERE id = (
                SELECT id FROM jobs WHERE status = 'pending'
                ORDER BY created_at LIMIT 1
                FOR UPDATE SKIP LOCKED
            )
            RETURNING id, url
        """).fetchone()


def _finish(job_id, recipe_id=None, error=None):
    status = "failed" if error else "done"
    with pool.connection() as conn:
        conn.execute(
            "UPDATE jobs SET status = %s, error = %s, recipe_id = %s, "
            "updated_at = now() WHERE id = %s",
            (status, error, recipe_id, job_id),
        )


def _process(job):
    data = get_transcript(job["url"])
    log.info("Job %s: transcript via %s", job["id"], data["source"])
    recipe = structure_recipe(data["title"], data["description"], data["transcript"])
    if not recipe.is_recipe:
        raise ValueError("This video doesn't seem to contain a recipe")
    with pool.connection() as conn:
        row = conn.execute(
            "INSERT INTO recipes (title, source_url, servings, total_time_minutes, "
            "ingredients, steps) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
            (
                recipe.title,
                job["url"],
                recipe.servings,
                recipe.total_time_minutes,
                Jsonb([i.model_dump() for i in recipe.ingredients]),
                Jsonb([s.model_dump() for s in recipe.steps]),
            ),
        ).fetchone()
    return row["id"]


def _run():
    # Jobs left "processing" by a crash or restart go back in the queue
    with pool.connection() as conn:
        conn.execute("UPDATE jobs SET status = 'pending' WHERE status = 'processing'")
    log.info("Worker started")
    while True:
        job = _claim_job()
        if not job:
            time.sleep(3)
            continue
        log.info("Job %s: starting %s", job["id"], job["url"])
        try:
            recipe_id = _process(job)
            _finish(job["id"], recipe_id=recipe_id)
            log.info("Job %s: done, recipe %s", job["id"], recipe_id)
        except Exception as e:
            log.exception("Job %s failed", job["id"])
            _finish(job["id"], error=str(e)[:500])
        finally:
            unload_model()


def start_worker():
    threading.Thread(target=_run, daemon=True).start()