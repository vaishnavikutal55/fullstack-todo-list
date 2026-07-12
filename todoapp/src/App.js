import React, { useState, useEffect } from 'react';
import './App.css';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';

function App() { // <-- THIS LINE WAS MISSING!

  const [listTodo, setListTodo] = useState([]);

  // 1. FETCH all tasks from your backend when page opens
  useEffect(() => {
    fetch('http://localhost:5000/api/todos')
      .then(res => res.json())
      .then(data => setListTodo(data))
      .catch(err => console.error("Error fetching tasks:", err));
  }, []);

  // 2. ADD a new task to backend & update screen
  const addList = (inputText) => {
    if (inputText !== '') {
      fetch('http://localhost:5000/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      })
        .then(res => res.json())
        .then(newTodo => {
          setListTodo([...listTodo, newTodo]);
        })
        .catch(err => console.error("Error adding task:", err));
    }
  };

  // 3. DELETE a task by its MongoDB database ID
  const deleteListItem = (id) => {
    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => {
        const newList = listTodo.filter(item => item._id !== id);
        setListTodo(newList);
      })
      .catch(err => console.error("Error deleting task:", err));
  };

  return (
    <div className="main-container">
      <div className="center-container">
        <h1 className="app-heading">TODO</h1>
        <hr />
        <TodoInput addList={addList} />
        <div className="todo-list-wrapper">
          {listTodo.map((listItem) => {
            return (
              <TodoList
                key={listItem._id}
                index={listItem._id} // Passes the actual database _id down for the delete action
                item={listItem.text}
                deleteItem={deleteListItem}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;