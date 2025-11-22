import instance from "../instance/axiosInstance";
  const simulationDelay = 10000; 

// GET all todos
export function getTodos(endpoint) {
  return instance.get(endpoint);
}

// CREATE a new todo
export function createTodoRequest(endpoint, title) {
  return instance.post(endpoint, { title });
}

// DELETE a todo
export function deleteTodoRequest(endpoint, id) {
  return instance.delete(`${endpoint}/${id}`);
}

// TOGGLE todo completion status
export function toggleTodoRequest(endpoint, id) {
  return instance.put(`${endpoint}/${id}/toggle`);
}