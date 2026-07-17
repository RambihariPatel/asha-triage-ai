import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page-wrapper">
      <h1 className="not-found-code">404</h1>
      <p className="not-found-subtitle">Page not found</p>
      <Link to="/" className="not-found-home-link">
        Back to dashboard
      </Link>
    </div>
  );
};

export default NotFound;
