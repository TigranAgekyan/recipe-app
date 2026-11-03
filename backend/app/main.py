from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl

from app.db import migrate, pool
from app.worker import start_worker


@asynccontextmanager
async def lifespan(app):
    migrate()
    start_worker()
    yield


app = FastAPI(title="Recipe API", lifespan=lifespan)


class ImportRequest(BaseModel):
    url: HttpUrl


class FavouriteRequest(BaseModel):
    favourite: bool


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/recipes")
def list_recipes():
    with pool.connection() as conn:
        return conn.execute(
            "SELECT id, title, source_url, servings, total_time_minutes, is_favourite, created_at "
            "FROM recipes ORDER BY created_at DESC"
        ).fetchall()


@app.get("/recipes/{recipe_id}")
def get_recipe(recipe_id: int):
    with pool.connection() as conn:
        recipe = conn.execute(
            "SELECT * FROM recipes WHERE id = %s", (recipe_id,)
        ).fetchone()
    if not recipe:
        raise HTTPException(404, "Recipe not found")
    return recipe


@app.put("/recipes/{recipe_id}/favourite")
def set_favourite(recipe_id: int, req: FavouriteRequest):
    with pool.connection() as conn:
        recipe = conn.execute(
            "UPDATE recipes SET is_favourite = %s WHERE id = %s RETURNING id, is_favourite",
            (req.favourite, recipe_id),
        ).fetchone()
    if not recipe:
        raise HTTPException(404, "Recipe not found")
    return recipe


@app.post("/import", status_code=202)
def start_import(req: ImportRequest):
    with pool.connection() as conn:
        return conn.execute(
            "INSERT INTO jobs (url) VALUES (%s) RETURNING id, url, status, error, recipe_id",
            (str(req.url),),
        ).fetchone()


@app.get("/jobs")
def list_jobs():
    """Running jobs plus recent failures, so the UI can show imports started elsewhere."""
    with pool.connection() as conn:
        return conn.execute(
            "SELECT id, url, status, error, recipe_id FROM jobs "
            "WHERE status IN ('pending', 'processing') "
            "OR (status = 'failed' AND updated_at > now() - interval '1 hour') "
            "ORDER BY created_at DESC"
        ).fetchall()


@app.get("/jobs/{job_id}")
def get_job(job_id: int):
    with pool.connection() as conn:
        job = conn.execute(
            "SELECT * FROM jobs WHERE id = %s", (job_id,)
        ).fetchone()
    if not job:
        raise HTTPException(404, "Job not found")
    return job