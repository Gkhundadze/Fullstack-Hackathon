import { useState, useEffect } from "react";
import "./App.css";
import TodoList from "./components/TodoList/TodoList";
import TodoForm from "./components/TodoForm/TodoForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTodos, createTodoRequest, deleteTodoRequest, toggleTodoRequest } from "./services/todoService";
import SkeletonTodoList from "./components/SkeletonTodoList/SkeletonTodoList";

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [fadeSkeleton, setFadeSkeleton] = useState(false); // triggers CSS fade


  // ------------------ GET ALL TODOS ------------------
async function getAllTodos() {
  setLoading(true);
  setError(null);

  try {
    const response = await getTodos('todos');
    setTodos(response.data);

    // small delay to let browser render skeleton first
    requestAnimationFrame(() => {
      setFadeSkeleton(true);
    });

    // remove skeleton after fade duration (500ms)
    setTimeout(() => {
      setShowSkeleton(false);
    }, 500);
  } catch (err) {
    console.error(err);
    setError("Failed to load todos.");
    setShowSkeleton(false);
  } finally {
    setLoading(false);
  }
}

  // ------------------ CREATE TODO ------------------
  async function createTodo(title) {
    try {
      const response = await createTodoRequest('todos', title);
      setTodos((prev) => [...prev, response.data]);
      toast.success("Todo added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add todo.");
    }
  }

  // ------------------ DELETE TODO ------------------
  async function deleteTodo(id) {
    try {
      const response = await deleteTodoRequest('todos', id);
      if (response.status === 204) {
        setTodos((prev) => prev.filter((todo) => todo._id !== id));
        toast.success("Todo deleted successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete todo.");
    }
  }

  // ------------------ TOGGLE TODO ------------------
  async function toggleTodo(id) {
    try {
      const response = await toggleTodoRequest('todos', id);
      const updatedTodo = response.data;
      setTodos((prev) =>
        prev.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo))
      );
      toast.success(
        `Todo marked as ${updatedTodo.completed ? "completed" : "not completed"}!`
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle todo.");
    }
  }

  // ------------------ INITIAL LOAD ------------------
  useEffect(() => {
     getAllTodos();
  }, []);

  return (
    <>
      {/* Todo Form */}
      <TodoForm createTodo={createTodo} />
      {/* Skeleton Loader with fade-out */}
      {showSkeleton && (
        <div
          className={`skeleton-wrapper ${fadeSkeleton ? "fade-out" : ""}`}
          style={{ transition: "opacity 0.5s ease-in-out" }}
        >
          <SkeletonTodoList />
        </div>
      )}

      {/* Error Message */}
      {!loading && error && (
        <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
          {error}
        </p>
      )}

      {/* Todo List */}
      {!loading && !error && (
        <div
          className="todo-list-wrapper"
          style={{ opacity: showSkeleton ? 0 : 1, transition: "opacity 0.5s ease-in-out" }}
        >
          <TodoList
            todos={todos}
            deleteTodo={deleteTodo}
            toggleTodo={toggleTodo}
          />
        </div>
      )}

      <ToastContainer autoClose={2000} />
    </>
  );
}

export default App;