import React, { useState } from 'react';
import Login from './Components/LoginSignUp/Login.jsx';
import Signup from './Components/LoginSignUp/Signup.jsx';
import Homepage from './Components/Homepage/Homepage.jsx';
// import JobPost from './Components/LoginSignUp/JobPost.jsx';
import Navbar from './Components/shared/Navbar.jsx';
import Jobs from './Components/Homepage/Jobs.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Route,Routes } from 'react-router-dom';
import ResetPassword from './Components/LoginSignUp/ResetPassword.jsx';

// const appRouter = createBrowserRouter ([
//     {path:'/', element:<Homepage/>},
//     {path:'/login', element:<Login/>},
//     {path:'/signup', element:<Signup/>},
//     {path:'/jobs', element:<Jobs/>},
// ])

function App() {
    // const [isAuthenticated, setIsAuthenticated] = useState(false); 
    // const [loginView, setLoginView] = useState(true);

    // const handleLoginSuccess = () => {
    //     setIsAuthenticated(true);
    // };

    return (
        // <div className="App">
        //     {isAuthenticated ? (
        //         <Homepage /> 
        //     ) : (
        //         <div>
        //             {loginView ? (
        //                 <Login 
        //                     setLogin={setLoginView} 
        //                     onLoginSuccess={handleLoginSuccess} 
        //                 />
        //             ) : (
        //                 <Signup 
        //                     setLogin={setLoginView} 
        //                     onSignupSuccess={handleLoginSuccess} 
        //                 />
        //             )}
        //         </div>
        //     )}
        // </div>
        // <>
        //         <RouterProvider router= {appRouter}/>
        // </>
         
        <Routes>
         <Route path="/" element={<Homepage/>}/>
        
         <Route path="/signup" element={<Signup/>}/>
         <Route path="/login" element={<Login/>}/>
         <Route path="/reset-password" element={<ResetPassword/>}/>
         {/* <Route path="/jobs/post" element={<JobPost/>}/> */}
         <Route path="/navbar" element={<Navbar/>}/>
         <Route path="/jobs" element={<Jobs/>}/>
       </Routes>   
    );
}

export default App;
