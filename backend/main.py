from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import get_conn, init_db
from schemas import TodoCreate, TodoUpdate


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Todo API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def to_todo(row):
    return {
        "id": row["id"],
        "title": row["title"],
        "completed": bool(row["completed"]),
    }


@app.get("/todos")
def list_todos():
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT id, title, completed FROM todos ORDER BY id DESC"
        ).fetchall()
    return [to_todo(row) for row in rows]


@app.post("/todos", status_code=201)
def create_todo(payload: TodoCreate):
    title = payload.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Title is required")

    with get_conn() as conn:
        cursor = conn.execute(
            "INSERT INTO todos (title, completed) VALUES (?, 0)",
            (title,),
        )
        conn.commit()
        row = conn.execute(
            "SELECT id, title, completed FROM todos WHERE id = ?",
            (cursor.lastrowid,),
        ).fetchone()
    return to_todo(row)


@app.patch("/todos/{todo_id}")
def update_todo(todo_id: int, payload: TodoUpdate):
    with get_conn() as conn:
        row = conn.execute(
            "SELECT id, title, completed FROM todos WHERE id = ?",
            (todo_id,),
        ).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Todo not found")

        title = row["title"]
        if payload.title is not None:
            title = payload.title.strip()
            if not title:
                raise HTTPException(status_code=400, detail="Title is required")

        completed = row["completed"]
        if payload.completed is not None:
            completed = int(payload.completed)

        conn.execute(
            "UPDATE todos SET title = ?, completed = ? WHERE id = ?",
            (title, completed, todo_id),
        )
        conn.commit()
        updated = conn.execute(
            "SELECT id, title, completed FROM todos WHERE id = ?",
            (todo_id,),
        ).fetchone()
    return to_todo(updated)


@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int):
    with get_conn() as conn:
        cursor = conn.execute("DELETE FROM todos WHERE id = ?", (todo_id,))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Todo not found")
