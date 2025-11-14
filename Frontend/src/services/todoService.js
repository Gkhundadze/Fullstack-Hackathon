import instance from "../instance/axiosInstance";
  const simulationDelay = 10000; 

// GET all todos
export function getTodos() {
  return instance.get("todos");
}

// CREATE a new todo
export function createTodoRequest(title) {
  return instance.post("todos", { title });
}

// DELETE a todo
export function deleteTodoRequest(id) {
  return instance.delete(`todos/${id}`);
}

// TOGGLE todo completion status
export function toggleTodoRequest(id) {
  return instance.put(`todos/${id}/toggle`);
}