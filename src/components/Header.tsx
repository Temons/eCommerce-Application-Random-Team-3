import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.scss';

const Header = () => {
  return (
    <header className="app-header">
      <nav>
        <ul>
          <li><Link to="/main">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
           <li><Link to="/cart">Cart</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
