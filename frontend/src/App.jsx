import React from 'react';
import Login from './Components/LoginSignUp/Login.jsx';
import Signup from './Components/LoginSignUp/Signup.jsx';
import ResetPassword from './Components/LoginSignUp/ResetPassword.jsx';
import Homepage from './Components/Homepage/Homepage.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Jobs from './Components/Homepage/Jobs.jsx';

const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <Homepage />
    },
    {
        path: '/signup',
        element: <Signup />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/reset-password',
        element: <ResetPassword />
    }
]);

function App() {
    return (
        // <RouterProvider router={appRouter} />
        <Jobs/>
    );
}

export default App;
