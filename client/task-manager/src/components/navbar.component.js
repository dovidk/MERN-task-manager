import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Navbar({ setLoggedIn, isAdmin }) {
    const history = useHistory();

    const handleLogout = async () => {
        const resp = await fetch('http://localhost:80/user/logout', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!resp.ok) {
            return console.error(resp.statusText);
        }
        Cookies.remove('jwt');
        Cookies.remove('isAdmin');
        history.push('/');
        setLoggedIn(false);
    };

    return (
        <nav className='navbar navbar-dark bg-dark navbar-expand-lg'>
            <Link to='/home' className='navbar-brand'>Task Manager</Link>
            <div className='collpase navbar-collapse'>
                <ul className='navbar-nav mr-auto'>
                    <li className='navbar-item'>
                        <Link to='/tasks' className='nav-link'>Tasks</Link>
                    </li>
                    <li className='navbar-item'>
                        <Link to='/create' className='nav-link'>Create Task</Link>
                    </li>
                    <li className='navbar-item'>
                        <Link to='/profile' className='nav-link'>My profile</Link>
                    </li>
                    {isAdmin ? <li className='navbar-item'>
                        <Link to='/admin' className='nav-link'>Admin page</Link>
                    </li> : null}
                    <li className='navbar-item nav-link' style={{ cursor: 'pointer' }} onClick={handleLogout}>Logout</li>
                </ul>
            </div>
        </nav>
    );
}