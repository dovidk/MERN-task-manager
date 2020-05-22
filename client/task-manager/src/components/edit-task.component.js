import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


export default function EditTask() {
    let [description, setDescription] = useState('');
    let [completed, setCompleted] = useState(false);
    let [date, setDate] = useState(new Date());
    const id = window.location.pathname.substring(6);
    const history = useHistory();


    useEffect(() => {
        fetch(`http://localhost:80/task/${id}`, { credentials: 'include' })
            .then(res => res.json())
            .then(result => {
                setDescription(result.description);
                setCompleted(result.completed);
                setDate(result.date);
            })
            .catch(e => console.log(e));
    }, [id]);

    const submitHandler = async (e) => {
        e.preventDefault();
        const task = {
            description,
            completed,
            dueDate: date
        };

        const resp = await fetch(`http://localhost:80/task/${id}`, {
            credentials: 'include',
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        if (!resp.ok) {
            return console.error(resp.statusText);
        }
        history.push('/tasks');
    }

    return (
        < div className='container' >
            <div>
                <h3>Edit Task</h3>
                <form onSubmit={submitHandler}>
                    <div className='form-group'>
                        <label>Description: </label>
                        <input type='text'
                            required
                            className='form-control'
                            value={description}
                            onChange={e => { console.log(e.target.value); setDescription(e.target.value) }}
                        />
                    </div>
                    <div className='form-group form-check'>
                        <input type='checkbox' className='form-check-input' checked={completed} onChange={e => e.target.checked ? setCompleted(true) : setCompleted(false)} />
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
                        <input type='submit' value='Edit Task' className='btn btn-primary' />
                    </div>
                </form>
            </div>
        </div >
    )
}