import { useState } from 'react';
import './App.css'
import { instance } from './instance/axiosInstance';
import TodoList from './components/TodoList/TodoList';
import { useEffect } from 'react';
import TodoForm from './components/TodoForm/TodoForm';

function App() {
  const [todos, setTodos] = useState([]);

  async function getAllTodos() {
    try {

      const response = await instance.get('todos');
      console.log(response.data);

      setTodos(response.data);
    }
    catch (err) {
      console.error(err);
    }

  }

  async function createNewTodo(newTodo) {
    try {
      const response = await instance.post('todos', newTodo);
      console.log(response.data);

      if (response.status === 201) {
        // Refresh the todo list after successful creation
        getAllTodos();
      }
      
    }
    catch (err) {
      console.error(err);
    }

  }

  async function checkTodo(id) {
    try {
      const response = await instance.put(`todos/${id}/toggle`);
      console.log(response.data);

      if (response.status === 200) {
        // Refresh the todo list after successful update
        getAllTodos();
      }
      
    }
    catch (err) {
      console.error(err);
    }

  } 

  async function deleteTodo(id) {
    try {
      const response = await instance.delete(`todos/${id}`);
      console.log(response.data);

      if (response.status === 204) {
        // Refresh the todo list after successful deletion
        getAllTodos();
      }
      
    }
    catch (err) {
      console.error(err);
    }

  } 

  useEffect(() => {
    getAllTodos();
  }, []);

  return (
    <>
      <TodoForm createNewTodo={createNewTodo} />
      <TodoList todos={todos} checkTodo={checkTodo} deleteTodo={deleteTodo}/>
    </>
  )
}

export default App
