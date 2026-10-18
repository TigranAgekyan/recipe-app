from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl

from app.db import pool
from app.worker import start_worker


@asynccontextmanager
async def lifespan(app):
    start_worker()
    yield


app = FastAPI(title="Recipe API", lifespan=lifespan)


class ImportRequest(BaseModel):
    url: HttpUrl


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/recipes")
def list_recipes():
    with pool.connection() as conn:
        return conn.execute(
            "SELECT id, title, servings, total_time_minutes, created_at "
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


@app.post("/import", status_code=202)
def start_import(req: ImportRequest):
    with pool.connection() as conn:
        return conn.execute(
            "INSERT INTO jobs (url) VALUES (%s) RETURNING id, status",
            (str(req.url),),
        ).fetchone()


@app.get("/jobs/{job_id}")
def get_job(job_id: int):
    with pool.connection() as conn:
        job = conn.execute(
            "SELECT * FROM jobs WHERE id = %s", (job_id,)
        ).fetchone()
    if not job:
        raise HTTPException(404, "Job not found")
    return job