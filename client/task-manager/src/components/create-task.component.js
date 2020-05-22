import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useHistory } from 'react-router-dom';

export default function CreateTask() {

    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);
    const [date, setDate] = useState(new Date());
    const history = useHistory();

    const submitHandler = async (e) => {
        e.preventDefault();
        const task = {
            description,
            completed,
            dueDate: date
        };
        const resp = await fetch('http://localhost:80/task', {
            credentials: 'include',
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        if (!resp.ok) {
            return console.error(resp.statusText);
        }
        history.push('/tasks')
    }

    return (
        <div className='container'>
            <div>
                <h3>Create New Task</h3>
                <form onSubmit={submitHandler}>
                    <div className='form-group'>
                        <label>Description: </label>
                        <input type='text'
                            required
                            className='form-control'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                    <div className='form-group form-check'>
                        <input type='checkbox' className='form-check-input' id='completed' checked={completed} onChange={e => e.target.checked ? setCompleted(true) : setCompleted(false)} />
                        <label className='form-check-label' htmlFor='completed'>Completed</label>
                    </div>
                    <div className='form-group'>
                        <label>Date to be completed by: </label>
                        <div>
                            <DatePicker
                                selected={date}
                                onChange={e => setDate(e)}
                            />
                        </div>
                    </div>
                    <div className='form-group'>
                        <input type='submit' value='Create Task' className='btn btn-primary' />
                    </div>

                </form>
            </div>
        </div>
    )
}