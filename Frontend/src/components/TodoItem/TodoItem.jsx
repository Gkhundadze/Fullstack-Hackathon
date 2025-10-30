import React from 'react'

export default function TodoItem({ todo, checkTodo, deleteTodo }) {

  function handleCheckboxChange() {
    checkTodo(todo.id);
  }
  function handleDeleteClick() {
    deleteTodo(todo.id);
  } 

  return (
    <>
      <li>
          <span>{todo.title}</span>
          <input onChange={handleCheckboxChange} type="checkbox" checked={todo.completed}/>
          <input type="button" onClick={handleDeleteClick} value="remove" />
      </li>
    </>
  )
}
