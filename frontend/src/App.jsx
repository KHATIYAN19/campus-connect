import React, { useState } from 'react';
import Login from './Components/LoginSignUp/Login.jsx';
import Signup from './Components/LoginSignUp/Signup.jsx';
import Homepage from './Components/Homepage/Homepage.jsx';
import Navbar from './Components/shared/Navbar.jsx';
import Jobs from './Components/Homepage/Jobs.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


const appRouter = createBrowserRouter ([
    {path:'/', element:<Homepage/>},
    {path:'/login', element:<Login/>},
    {path:'/signup', element:<Signup/>},
    {path:'/jobs', element:<Jobs/>},
])

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

        <Homepage/>
    );
}

export default App;
