import React from "react"
import { Outlet, Navigate } from "react-router-dom";
const Protected = ({}) => {
    const isLogin=localStorage.getItem('isLogin');
    const role=localStorage.getItem('role');
    const user=JSON.parse(localStorage.getItem('user'));
     
     if(!isLogin){
       return <Navigate to={"/login"}/>
     }else{
        // if(role==='student'){
        //   return <Navigate to={"/"}/>
        // }
        return <Outlet/>
     }
};

export default Protected;
