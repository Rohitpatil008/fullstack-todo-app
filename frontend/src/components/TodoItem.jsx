import { useState } from "react";

export default function TodoItem({ todo, onToggle, onSave, onDelete, onError }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  async function handleSave(e) {
    e.preventDefault();
    const title = draft.trim();
    if (!title || title === todo.title) {
      setDraft(todo.title);
      setEditing(false);
      return;
    }

    try {
      await onSave(todo.id, title);
      setEditing(false);
    } catch (err) {
      onError(err.message);
    }
  }

  async function handleToggle() {
    try {
      await onToggle(todo);
    } catch (err) {
      onError(err.message);
    }
  }

  async function handleDelete() {
    try {
      await onDelete(todo.id);
    } catch (err) {
      onError(err.message);
    }
  }

  return (
    <li className={`item ${todo.completed ? "done" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        aria-label={`Mark "${todo.title}" complete`}
      />

      {editing ? (
        <form className="edit-form" onSubmit={handleSave}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleSave}
            autoFocus
          />
        </form>
      ) : (
        <span className="title" onDoubleClick={() => setEditing(true)}>
          {todo.title}
        </span>
      )}

      <div className="actions">
        {!editing && (
          <button type="button" className="ghost" onClick={() => setEditing(true)}>
            Edit
          </button>
        )}
        <button type="button" className="ghost danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </li>
  );
}
