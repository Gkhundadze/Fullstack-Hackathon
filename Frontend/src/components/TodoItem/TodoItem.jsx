import { motion } from "framer-motion";
import "./TodoItem.css";

export default function TodoItem({ todo, deleteTodo, toggleTodo }) {
  return (
    <motion.li
      className={`todo-item ${todo.completed ? "completed" : ""}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      layout // smooth reordering animation
    >
      <span>{todo.title}</span>

      <div className="buttons">
        <button
          className={`toggle-btn ${todo.completed ? "undo" : "done"}`}
          onClick={() => toggleTodo(todo._id)}
        >
          {todo.completed ? "Undo" : "Done"}
        </button>

        <button
          className="delete-btn"
          onClick={() => deleteTodo(todo._id)}
        >
          X
        </button>
      </div>
    </motion.li>
  );
}
