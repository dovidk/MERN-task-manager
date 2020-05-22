import React, { useState, useEffect } from 'react';

export default function Admin() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:80/user/users', { credentials: 'include' })
            .then(res => res.json())
            .then(result => {
                if (result) {
                    setUsers(result);
                }
            })
            .catch(e => console.log(e));
    }, []);

    const display =
        <div className='container'>
            <h3>Users</h3>
            {users.length ? users.map(user =>
                <div key={user._id}>
                    <div className='card' style={{ textAlign: 'center' }}>
                        <div className='card-header'>
                            {user.name}
                        </div>
                        <ul className='list-group list-group-flush'>
                            {user.isAdmin ? <li className='list-group-item'>Administrator</li> : null}
                            <li className='list-group-item'>{user.email}</li>
                            <li className='list-group-item'>{user.age} years old</li>
                        </ul>
                    </div>
                    <br />
                </div>
            ) :
                <div className='text-center'>
                    <div className='spinner-border' role='status'>
                        <span className='sr-only'>Loading...</span>
                    </div>
                </div>}
        </div>

    return (
        display
    )
}