import React from 'react'
import Login from './Components/LoginSignUp/Login.jsx';
import Signup from './Components/LoginSignUp/Signup.jsx';
import ResetPassword from './Components/LoginSignUp/ResetPassword.jsx';
import { Route,Routes } from 'react-router-dom'
import { useState } from 'react';
function App() {
    const [login,setLogin]=useState(false);
  return (
    <>
      <div>
      <Routes>
       
         <Route path="/login" element={<Login/>}/>
         <Route path="/signup" element={<Signup/>}/>
         <Route path="/reset-password" element={<ResetPassword/>}/>
        
       </Routes>   
        {/* {
            login? <Login setLogin={setLogin}></Login>:<Signup setLogin={setLogin}></Signup>
        }
        <ResetPassword></ResetPassword> */}
      </div>
    </>
  );
}

export default App;
