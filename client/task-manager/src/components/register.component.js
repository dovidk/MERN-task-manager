import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';


const Register = ({ setLoggedIn }) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const history = useHistory();

    const submitHandler = async (e) => {
        e.preventDefault();
        const userInfo = {
            name,
            password,
            age,
            email
        }
        const resp = await fetch('http://localhost:80/user', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        });
        if (resp.ok) {
            setLoggedIn(true)
            history.push('/home')
        }
        if (!resp.ok) {
            alert('Something went wrong. Please try again.');
            return console.error(resp);

        }
    }

    return (
        <div className='container' style={{
            textAlign: 'center'
        }}>
            <h2>Welcome!</h2>
            <h4>Please sign up</h4>
            <form onSubmit={submitHandler}>
                <div className='form-group'>
                    <label>Username</label>
                    <input type='text' className='form-control' value={name}
                        onChange={e => setName(e.target.value)} />
                </div>
                <div className='form-group'>
                    <label>Email</label>
                    <input type='email' className='form-control' value={email}
                        onChange={e => setEmail(e.target.value)} />
                </div>
                <div className='form-group'>
                    <label>Age</label>
                    <input type='number' className='form-control' value={age}
                        onChange={e => setAge(e.target.value)} />
                </div>
                <div className='form-group'>
                    <label>Password</label>
                    <input type='password' className='form-control' value={password}
                        onChange={e => setPassword(e.target.value)} />
                </div>
                <button type='submit' className='btn btn-primary'>Register</button>
            </form>
        </div >
    )
}

export default Register;