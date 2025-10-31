import { useState } from 'react';
import './App.css'
import { instance } from './instance/axiosInstance';
import TodoList from './components/TodoList/TodoList';
import { useEffect } from 'react';
import TodoForm from './components/TodoForm/TodoForm';

function App() {
  // save todos in state
  const [todos, setTodos] = useState([]);

// get all todos from backend
  async function getAllTodos() {
    try {
      const response = await instance.get('todos');
      setTodos(response.data);
    }
    catch (err) {
      console.error(err);
    }
  }
// create new todo, takes newTodo object as parameter
  async function createNewTodo(newTodo) {
    try {
      const response = await instance.post('todos', newTodo);
      if (response.status === 201) {
        // Refresh the todo list after successful creation
        getAllTodos();
      }
    }
    catch (err) {
      console.error(err);
    }
  }
// toggle todo completed status, takes todo id as parameter
  async function checkTodo(id) {
    try {
      const response = await instance.put(`todos/${id}/toggle`);
      if (response.status === 200) {
        // Refresh the todo list after successful update
        getAllTodos();
      }
    }
    catch (err) {
      console.error(err);
    }
  } 
// delete todo, takes todo id as parameter
  async function deleteTodo(id) {
    try {
      const response = await instance.delete(`todos/${id}`);
      if (response.status === 204) {
        // Refresh the todo list after successful deletion
        getAllTodos();
      }
    }
    catch (err) {
      console.error(err);
    }
  } 

  // Initial fetch of todos
  useEffect(() => {
    getAllTodos();
  }, []);

  return (
    <>
        {/* renders todo form, passing createNewTodo as prop */}
      <TodoForm createNewTodo={createNewTodo} />
        {/* renders todo list passing checkTodo and deleteTodo as prop */}
      <TodoList todos={todos} checkTodo={checkTodo} deleteTodo={deleteTodo}/>
    </>
  )
}

export default App
