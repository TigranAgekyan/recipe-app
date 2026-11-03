import os
from psycopg_pool import ConnectionPool
from psycopg.rows import dict_row

pool = ConnectionPool(
    os.environ["DATABASE_URL"],
    kwargs={"row_factory": dict_row},
    open=True,
)


def migrate():
    # init.sql only runs on an empty database, so existing ones get new columns here
    with pool.connection() as conn:
        conn.execute(
            "ALTER TABLE recipes ADD COLUMN IF NOT EXISTS "
            "is_favourite BOOLEAN NOT NULL DEFAULT false"
        )