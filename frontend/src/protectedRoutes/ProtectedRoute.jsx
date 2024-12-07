import React from "react"
import { Outlet, Navigate } from "react-router-dom";
const ProtectedRoute = ({ element }) => {
  const isLogin = localStorage.getItem('isLogin');
  if (!isLogin) {
    return <Navigate to="/login" replace />; 
  }
  return element;
};

export default ProtectedRoute;
