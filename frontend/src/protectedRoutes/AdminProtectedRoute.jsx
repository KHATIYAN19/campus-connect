import React from 'react';
import { Navigate } from 'react-router-dom';
const AdminProtectedRoute = ({ element }) => {
    const isLogin = localStorage.getItem('isLogin');
    const role = localStorage.getItem('role');
    const isAdmin=(role==='admin')?true:false;
    if (!isLogin) {
      return <Navigate to="/login" replace />;
    }
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
     return element; 
};

export default AdminProtectedRoute;
