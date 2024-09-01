import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Custom CSS for gradient background

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error(error));
  }, []);

  const addTask = () => {
    axios.post('http://localhost:5000/tasks', { text: task, completed: false })
      .then(response => {
        setTasks([...tasks, response.data]);
        setTask('');
      })
      .catch(error => console.error(error));
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task._id !== id)))
      .catch(error => console.error(error));
  };

  const toggleComplete = (id, completed) => {
    axios.put(`http://localhost:5000/tasks/${id}`, { completed: !completed })
      .then(response => setTasks(tasks.map(task => task._id === id ? response.data : task)))
      .catch(error => console.error(error));
  };

  return (
    <div className="container-fluid bg-gradient">
      <div className="container py-5">
        <h1 className="text-center mb-4">To-Do List</h1>
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add a new task"
          />
          <div className="input-group-append">
            <button className="btn btn-primary" onClick={addTask}>Add Task</button>
          </div>
        </div>
        <ul className="list-group">
          {tasks.map(t => (
            <li key={t._id} className="list-group-item d-flex justify-content-between align-items-center">
              <span style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>{t.text}</span>
              <div>
                <button
                  className={`btn ${t.completed ? 'btn-success' : 'btn-warning'} btn-sm mr-2`}
                  onClick={() => toggleComplete(t._id, t.completed)}
                >
                  {t.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteTask(t._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
