import { AnimatePresence } from "framer-motion";
import TodoItem from "../TodoItem/TodoItem";
import "./TodoList.css";

export default function TodoList({ todos, deleteTodo, toggleTodo }) {
  return (
    <ul className="todo-list">
      <AnimatePresence>
        {todos.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}
