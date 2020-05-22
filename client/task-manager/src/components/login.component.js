import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';


const Login = ({ setLoggedIn }) => {
    const history = useHistory();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userInfo = {
            name,
            password
        }
        const resp = await fetch('http://localhost:80/user/login', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        });
        if (resp.ok) {
            const user = await resp.json();
            if (user.user.isAdmin) {
                Cookies.set('isAdmin', 'true', { expires: 3600 });
            }
            setLoggedIn(true);
            history.push('/home');
        }
        if (!resp.ok) {
            alert('Invalid username or password');
            return console.error(resp.statusText);
        }
    }

    const registering = window.location.pathname.substring(1);

    const display = registering === 'register' ? null :
        <div className='container' style={{
            textAlign: 'center'
        }}>
            <h2>Welcome!</h2>
            <h4>Please login</h4>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>Username</label>
                    <input type='text' className='form-control' value={name}
                        onChange={e => setName(e.target.value)} />
                </div>
                <div className='form-group'>
                    <label>Password</label>
                    <input type='password' className='form-control' value={password}
                        onChange={e => setPassword(e.target.value)} />
                </div>
                <button type='submit' className='btn btn-primary'>Login</button>
            </form>
            <Link to='/register' className='navbar-brand'>Create account here</Link>
        </div >

    return (
        display
    )
}

export default Login;