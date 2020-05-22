import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default function ProtectedRoute({ component: Component, loggedIn, ...props }) {

    return (
        <Route
            {...props}
            render={props => (
                loggedIn ?
                    <Component {...props} setLoggedIn={props.setLoggedIn} /> :
                    <Redirect to='/' />
            )}
        />
    )
}
