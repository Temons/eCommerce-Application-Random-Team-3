import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFoundPage.scss';
import NotFoundPageImage from '../assets/notFoundPage.png';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you’re looking for doesn’t exist or has been moved.</p>

      <img src={NotFoundPageImage} alt="Page not found" className="not-found-image" />

      <Link to="/main" className="back-home-button">
        🔙 Go to Main Page
      </Link>
    </div>
  );
};

export default NotFoundPage;
