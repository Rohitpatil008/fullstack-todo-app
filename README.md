# Todo app

Simple full-stack todos. FastAPI + SQLite in `backend/`, React (Vite) in `frontend/`.

## Run locally

You need Python 3.12–3.14 and Node.js 18+.

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

On macOS/Linux, activate with `source .venv/bin/activate`.

API: http://127.0.0.1:8000  
Docs: http://127.0.0.1:8000/docs

### Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Vite proxies `/api` to the backend, so both need to be running.

## What you can do

- Add a todo
- Mark it complete
- Edit the title (Edit button or double-click)
- Delete it

Data is stored in `backend/todos.db`.
