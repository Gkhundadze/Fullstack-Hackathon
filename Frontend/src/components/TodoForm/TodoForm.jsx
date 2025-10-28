import { useState, useEffect } from 'react'
export default function TodoForm({createNewTodo}) {
  const [todoTitle, setTodoTitle] = useState('');
  const [error, setError] = useState("");

  // todo title length limit
  const todoMaxLenght = 50;
  const todoMinLenght = 3;



  const handleSubmit = (e) => {
    e.preventDefault();

    if (!todoTitle.trim()) {
      setError("Todo item cannot be empty!");
      return;
    }
    
    if (todoTitle.length < todoMinLenght) {
      setError(`Todo item must be at least ${todoMinLenght} characters.`);
      return;
    }

    if (todoTitle.length > todoMaxLenght) {
      setError(`Todo item must be under ${todoMaxLenght} characters.`);
      return;
    }

    // Clear error if validation passes
    setError("");

    // Here you would typically handle the submission, e.g., call a prop function
    const newTodo = {
      title: todoTitle
    };
    console.log("Submitting todo:", newTodo);

    createNewTodo(newTodo);
    // Reset the input field
    setTodoTitle('');
    
  }

  const handleChange = (e) => {
    setTodoTitle(e.target.value);
  }


  useEffect(() => {
    // Any side effects related to todoTitle can be handled here
    console.log('Todo title changed:', todoTitle);
    
  }, [todoTitle]);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={todoTitle}
          onChange={handleChange}
          placeholder="Enter todo title"
        />
        <button type="submit">Add Todo</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  )
}