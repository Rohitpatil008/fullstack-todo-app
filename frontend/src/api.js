const BASE = "/api/todos";

async function request(path = "", options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || "Request failed");
  }

  if (res.status === 204) return null;
  return res.json();
}

export const getTodos = () => request();

export const createTodo = (title) =>
  request("", {
    method: "POST",
    body: JSON.stringify({ title }),
  });

export const updateTodo = (id, data) =>
  request(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteTodo = (id) =>
  request(`/${id}`, {
    method: "DELETE",
  });
