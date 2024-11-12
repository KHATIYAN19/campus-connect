import React from "react"
import { Outlet, Navigate } from "react-router-dom";
const isLogin=localStorage.getItem('isLogin');
const role=localStorage.getItem('role');
const user=JSON.parse(localStorage.getItem('user'));
const loginProtected = () => {
     if(isLogin){
       return <Navigate to={"/"}/>
     }else{
        return <Outlet/>
     }
  
  
};

export default loginProtected;
