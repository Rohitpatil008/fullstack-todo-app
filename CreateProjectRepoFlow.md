# CreateProjectRepoFlow

This file explains the repo in plain words.

## What this project is

A small todo website.

You type a task. It saves. You can tick it done, change the text, or delete it.

There are two parts:

- **backend** — the server. It stores todos.
- **frontend** — the page you see in the browser.

## Folder layout

```
backend/     Python API
frontend/    React app
README.md    how to run it
```

## How it works, start to finish

1. You open the website (`frontend`).
2. The page asks the server for all todos.
3. The server reads them from a small SQLite file (`todos.db`) and sends them back.
4. The page shows the list.
5. When you add, edit, complete, or delete a todo, the page sends that action to the server.
6. The server updates the database, then the page updates the list.

That is the whole loop.

## Backend flow

File: `backend/main.py`

On start, it creates the `todos` table if it is missing.

Routes:

| Action | Method | Path |
| --- | --- | --- |
| Get all todos | GET | `/todos` |
| Add a todo | POST | `/todos` |
| Change a todo | PATCH | `/todos/{id}` |
| Remove a todo | DELETE | `/todos/{id}` |

A todo has:

- `id` — number
- `title` — the text
- `completed` — true or false

`backend/database.py` opens SQLite.  
`backend/schemas.py` checks the JSON the client sends.

If the title is empty, the API says no (400).  
If the id does not exist, the API says not found (404).

## Frontend flow

File: `frontend/src/App.jsx`

1. Load todos when the page opens.
2. `TodoForm` adds a new one.
3. `TodoItem` can tick, edit, or delete one.
4. `api.js` talks to `/api/todos`.
5. Vite sends `/api` to `http://127.0.0.1:8000`, so the browser does not need to know the Python port.

## Exact functionality

- Add a task (title cannot be blank).
- See all tasks. Incomplete count is shown at the top.
- Mark a task done or not done.
- Edit a task (button or double-click the title).
- Delete a task.
- If the server is down or a request fails, an error line shows on the page.
- Data stays in SQLite, so it is still there after you restart the server.

## What is not in this app

- Login / users
- Cloud hosting
- Fancy extra features

It is a local CRUD todo app: Create, Read, Update, Delete.
