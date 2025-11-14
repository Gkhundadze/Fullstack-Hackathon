import {useState} from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "./TodoForm.css";

export default function TodoForm({ createTodo }) {
  const [title, setTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title cannot be empty!");
      return;
    }

    createTodo(title);
    setTitle("");
    toast.success("Todo added successfully!");
  }

  return (
    <motion.form
      className="todo-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <input
        type="text"
        name="todo-title"
        placeholder="Add a new todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">Add</button>
    </motion.form>
  );
}
