import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import TodoList from "./components/TodoList/TodoList";
import TodoForm from "./components/TodoForm/TodoForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [todos, setTodos] = useState([]);

  // ------------------ GET ALL TODOS ------------------
  async function getAllTodos() {
    try {
      const response = await axios.get("http://localhost:5000/api/todos");
      setTodos(response.data);
      toast.success("Todos loaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch todos.");
    }
  }

  // ------------------ CREATE TODO ------------------
  async function createTodo(title) {
    try {
      const response = await axios.post("http://localhost:5000/api/todos", { title });
      setTodos([...todos, response.data]);
      toast.success("Todo added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add todo.");
    }
  }

  // ------------------ DELETE TODO ------------------
  async function deleteTodo(id) {
    try {
      const response = await axios.delete(`http://localhost:5000/api/todos/${id}`);
      if (response.status === 204) {
        setTodos(prev => prev.filter(todo => todo._id !== id));
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
      const response = await axios.put(`http://localhost:5000/api/todos/${id}/toggle`);
      const updatedTodo = response.data;

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo._id === updatedTodo._id ? updatedTodo : todo
        )
      );
      toast.success(`Todo marked as ${updatedTodo.completed ? "completed" : "not completed"}!`);
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
      <TodoForm createTodo={createTodo} />
      <TodoList todos={todos} deleteTodo={deleteTodo} toggleTodo={toggleTodo} />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
