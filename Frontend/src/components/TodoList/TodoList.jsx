import TodoItem from '../TodoItem/TodoItem'

export default function TodoList({ todos, checkTodo, deleteTodo }) {
  return (
    <>
        <ul>
          {todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} checkTodo={checkTodo} deleteTodo={deleteTodo} />
          ))}
          {todos.length === 0 && <li>No todo items found.</li>}
        </ul>
    </>
  )
}
