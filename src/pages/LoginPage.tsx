import React from 'react';
import '../styles/LoginPage.scss';
import { Link } from 'react-router-dom';

const LoginPage = () => {

  return (
    <div className="main-block">
      <div className="login-block">
        <h1>Login Page</h1>
        <div className='username-block'>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" placeholder="Enter your username" minLength={4} required />
        </div>
        <div className='password-block'>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" minLength={8} required />
        </div>
        <button className="login-btn">Login</button>
        <p className="register-link">
        Don't have an account? <Link to="/register">Registration</Link>
      </p>
      </div>
    </div>
  );
};

export default LoginPage;
