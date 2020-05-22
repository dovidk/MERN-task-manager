import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Cookies from 'js-cookie';

import Navbar from './components/navbar.component';
import TaskList from './components/task-list.component';
import EditTask from './components/edit-task.component';
import CreateTask from './components/create-task.component';
import Login from './components/login.component';
import Profile from './components/profile.component';
import HomePage from './components/homepage.component';
import Footer from './components/footer.component';
import ProtectedRoute from './components/protectedRoute.component';
import Register from './components/register.component';
import Admin from './components/admin.component';

function App() {
  const cookie = Cookies.get('jwt');
  const adminCookie = Cookies.get('isAdmin');
  const isAdmin = adminCookie ? true : false;
  const isLoggedIn = cookie ? true : false;
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  
  return (
    <Router>
      <Route path='/' render={() => loggedIn ? <Navbar isAdmin={isAdmin} setLoggedIn={setLoggedIn} /> : <Login setLoggedIn={setLoggedIn} />} />
      <ProtectedRoute path='/tasks' component={TaskList} loggedIn={loggedIn} />
      <ProtectedRoute path='/edit/:id' component={EditTask} loggedIn={loggedIn} />
      <ProtectedRoute path='/create' component={CreateTask} loggedIn={loggedIn} />
      <ProtectedRoute path='/profile' component={Profile} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Route path='/register' render={() => <Register loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
      <ProtectedRoute path='/home' component={HomePage} loggedIn={loggedIn} />
      <ProtectedRoute path='/admin' component={Admin} loggedIn={isAdmin} />
      <Footer />
    </Router >

  );
}

export default App;