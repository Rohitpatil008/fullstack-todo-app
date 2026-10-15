import { useState } from "react";

export default function TodoForm({ onAdd, onError }) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const next = title.trim();
    if (!next) return;

    setSaving(true);
    try {
      await onAdd(next);
      setTitle("");
    } catch (err) {
      onError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        disabled={saving}
        autoFocus
      />
      <button type="submit" disabled={saving || !title.trim()}>
        Add
      </button>
    </form>
  );
}
