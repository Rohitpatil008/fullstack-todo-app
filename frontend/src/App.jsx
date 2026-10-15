import { useEffect, useState } from "react";
import { createTodo, deleteTodo, getTodos, updateTodo } from "./api";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(title) {
    setError("");
    const todo = await createTodo(title);
    setTodos((prev) => [todo, ...prev]);
  }

  async function handleToggle(todo) {
    setError("");
    const updated = await updateTodo(todo.id, { completed: !todo.completed });
    setTodos((prev) => prev.map((item) => (item.id === todo.id ? updated : item)));
  }

  async function handleSave(id, title) {
    setError("");
    const updated = await updateTodo(id, { title });
    setTodos((prev) => prev.map((item) => (item.id === id ? updated : item)));
  }

  async function handleDelete(id) {
    setError("");
    await deleteTodo(id);
    setTodos((prev) => prev.filter((item) => item.id !== id));
  }

  const remaining = todos.filter((todo) => !todo.completed).length;

  return (
    <main className="page">
      <header className="header">
        <h1>Todos</h1>
        <p className="count">
          {remaining} left
        </p>
      </header>

      <TodoForm onAdd={handleAdd} onError={setError} />

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : todos.length === 0 ? (
        <p className="muted">Nothing here yet. Add a task above.</p>
      ) : (
        <ul className="list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onSave={handleSave}
              onDelete={handleDelete}
              onError={setError}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
