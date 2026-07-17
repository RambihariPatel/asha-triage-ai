import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

/**
 * Route protection guard that checks for the jwt_token cookie.
 * Redirects to the login page if the cookie is not present.
 */
const ProtectedRoute = () => {
  const token = Cookies.get('jwt_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
