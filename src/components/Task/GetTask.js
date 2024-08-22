import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../components/auth/AuthContext';
import Header from '../../navbar/Header';
import './task.css';
import { TiEdit } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';



const GetTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // const response = await axios.get('http://localhost:5000/api/getalltask', {
        //   headers: {
        //     Authorization: `${token}`,
        //   },
        // });
        // setTasks(response.data.data);

        const response = await axios.get('http://localhost:5000/api/getalltask', {
          headers: { Authorization: `${token}` }
        });

        const taskData = response.data.data;
        setTasks(taskData);


      } catch (error) {
        setError('Failed to fetch tasks. Please try again.');
      }

      finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);


  const handleEdit = (taskId) => {
    navigate(`/edittask/${taskId}`);
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.post(`http://localhost:5000/api/deletetask/${taskId}`, {
        headers: { Authorization: `${token}` },
      });
      // Remove the deleted task from the list
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleMarkAsComplete = async (taskId) => {
    try {
      await axios.post(`http://localhost:5000/api/updatetask/${taskId}`,
        { status: 'Complete' },
        { headers: { Authorization: `${token}` } }
      );
      // Update the task status in the list
      setTasks(prevTasks => prevTasks.map(task =>
        task._id === taskId ? { ...task, status: 'complete' } : task
      ));
    } catch (error) {
      console.error('Error marking task as complete:', error);
    }
  };


  // Display date in YYYY-MM-DD Format:

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };


  // Display date in DD-MM-YYYY Format:

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  //   const year = date.getFullYear();

  //   return `${day}-${month}-${year}`;
  // };

  return (
    <>
      <Header></Header>
      <header>
        <h1>Task List</h1>
      </header>

      <div className="task-list-container">
        {loading && <p>Loading tasks...</p>}
        {/* {error && <p className="error-message">{error}</p>} */}
        {tasks.length === 0 && !loading && <p>No tasks available.</p>}
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <h3>{task.taskname}</h3>
              <p><strong>Description:</strong> {task.description}</p>
              {/* <p><strong>Due Date:</strong> {task.duedate}</p> */}
              <p><strong>Due Date:</strong> {formatDate(task.duedate)}</p>
              <p><strong>Priority:</strong> {task.priority}</p>
              <p><strong>Status:</strong> {task.status}</p>

              <div className="task-actions">
                <button onClick={() => handleEdit(task._id)} className="edit-btn">Edit <TiEdit /></button>

                <button onClick={() => handleDelete(task._id)} className="delete-btn">Delete <MdDelete /></button>
                <button onClick={() => handleMarkAsComplete(task._id)} className="complete-btn">Mark as Complete <IoCheckmarkDoneCircle /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default GetTask;
