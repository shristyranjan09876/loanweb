import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const Noauth = () => {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default Noauth;
