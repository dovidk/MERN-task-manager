import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';

export default function Profile({ setLoggedIn }) {
    const [info, setInfo] = useState();
    const history = useHistory();

    useEffect(() => {
        fetch('http://localhost:80/user/me', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => setInfo(data))
            .catch(e => console.log(e));
    }, []);

    const deleteHandler = async () => {
        const resp = await fetch('http://localhost:80/user/me', {
            method: 'DELETE',
            credentials: 'include'
        });
        if (resp.ok) {
            Cookies.remove('jwt');
            setLoggedIn(false)
            history.push('/');
        }
        else {
            alert('unable to properly logout');
        }
    }

    const whatToDisplay = info ?
        <div className='container'>
            <h3>My profile</h3>
            <div className='card' style={{ textAlign: 'center' }}>
                <div className='card-header'>
                    {info.name}
                </div>
                <ul className='list-group list-group-flush'>
                    <li className='list-group-item'>{info.email}</li>
                    <li className='list-group-item'>{info.age} years old</li>
                </ul>
                <button type='button' className='btn btn-primary' onClick={deleteHandler}>Delete my profile</button>
            </div>
        </div> :
        <div className='text-center'>
            <div className='spinner-border' role='status'>
                <span className='sr-only'>Loading...</span>
            </div>
        </div>

    return (
        whatToDisplay
    )
}
