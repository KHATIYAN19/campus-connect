import React from "react"
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
 
  if (!isAuthenticated) {
     return <Navigate to="/login" replace />; 
  }
  return element;
};

export default ProtectedRoute;
