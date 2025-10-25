import { useState } from 'react';
import './App.css'
import axios from 'axios'
import TodoList from './components/TodoList/TodoList';
import { useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);

  async function getAllTodos() {
    const response = await axios.get('http://localhost:5000/api/todos');
    setTodos(response.data);
  }

  useEffect(() => {
    getAllTodos();
  }, []);

  return (
    <>
      <TodoList todos={todos} />
    </>
  )
}

export default App
