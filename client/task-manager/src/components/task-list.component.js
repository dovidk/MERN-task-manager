import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:80/task', { credentials: 'include' })
            .then(res => res.json())
            .then(result => {
                if (result) {
                    result.forEach(element => {
                        setTasks(task => [...task, element]);
                    });
                }
                setLoading(false)
            })
            .catch(e => console.log(e));
    }, []);

    const deleteTasks = async (id) => {
        fetch(`http://localhost:80/task/${id}`, {
            credentials: 'include',
            method: 'delete'
        }).then(setTasks(tasks.filter(e => e._id !== id))).catch(e => console.log(e));
    };

    const display =
        <div className='container'>
            <h3>My tasks</h3>
            {tasks.length ?
                <table className='table'>
                    <thead className='thead-light'>
                        <tr>
                            <th>Task</th>
                            <th>To be completed by</th>
                            <th>Completed</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(currentTask =>
                            <tr key={currentTask._id} >
                                <td>{currentTask.description}</td>
                                <td>{currentTask.dueDate.substring(0, 10)}</td>
                                <td>{currentTask.completed ? 'yes' : 'no'}</td>
                                <td>
                                    <Link to={`/edit/${currentTask._id}`}>edit</Link> | <a href='/tasks' onClick={() => { deleteTasks(currentTask._id) }}>delete</a>
                                </td>
                            </tr>)}
                    </tbody>
                </table> :
                <div className='text-center'>
                    {loading === false && tasks.length === 0 ?
                        <h3>No tasks</h3> :
                        <div className='spinner-border' role='status'>
                            <span className='sr-only'>Loading...</span>
                        </div>}
                </div>
            }
        </div>

    return (
        display
    )
}