import { useState } from 'react';
import './App.css'
import axios from 'axios'
import TodoList from './components/TodoList/TodoList';
import { useEffect } from 'react';
import TodoForm from './components/TodoForm/TodoForm';

function App() {
  const [todos, setTodos] = useState([]);

  async function getAllTodos() {
    try {
      const response = await axios.get('http://localhost:5000/api/todos');
      console.log(response.data);

      setTodos(response.data);
    }
    catch (err) {
      console.error(err);
    }

  }
  async function createNewTodo(newTodo) {
    try {
      const response = await axios.post('http://localhost:5000/api/todos', newTodo);
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

  useEffect(() => {
    getAllTodos();
  }, []);

  return (
    <>
      <TodoForm createNewTodo={createNewTodo} />
      <TodoList todos={todos} />
    </>
  )
}

export default App
