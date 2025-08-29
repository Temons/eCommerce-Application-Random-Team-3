import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MainPage.scss';

const MainPage = () => {
  return (
    <div className="main-page">
      <nav className="navigation">
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </nav>

      <h1>Welcome to the Main Page!</h1>
      <p>Select a page from the navigation above to get started.</p>
    </div>
  );
};

export default MainPage;
