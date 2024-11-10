import React from 'react'
import Login from './Components/LoginSignUp/Login.jsx';
import Signup from './Components/LoginSignUp/Signup.jsx';
import { useState } from 'react';
function App() {
    const [login,setLogin]=useState(false);
  return (
    <>
      <div>
        {
            login? <Login setLogin={setLogin}></Login>:<Signup setLogin={setLogin}></Signup>
        }
      </div>
    </>
  );
}

export default App;
