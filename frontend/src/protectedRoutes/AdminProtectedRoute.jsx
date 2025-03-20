import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
const AdminProtectedRoute = ({ element }) => {
   const { isAuthenticated } = useSelector((state) => state.auth);
   const role=useSelector((state)=>state.auth.user).role;
    const isAdmin=(role==='admin')?true:false;
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
     return element; 
};

export default AdminProtectedRoute;
