import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ role, children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // If no user is logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    // If user does not have the correct role, redirect to the appropriate page
    return <Navigate to={user.role === 'student' ? '/student' : '/company'} />;
  }

  return children; // If user is authenticated and has correct role, render the children (dashboard)
};

export default ProtectedRoute;
