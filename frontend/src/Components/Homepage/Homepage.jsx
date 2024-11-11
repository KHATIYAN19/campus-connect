import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import './HomePage.css';
import Navbar from '../shared/Navbar';
import JobCard from './JobCard';
import Jobs from './Jobs';


const Homepage = () => {
  // const [hover, setHover] = useState(null); 

  return (
    // <div className="homepage">
    //   {/* Top Right Login/SignUp Buttons */}
    //   <div className="auth-buttons">
    //     <Link to="/login">
    //       <button className="auth-button">Login</button>
    //     </Link>
    //     <Link to="/signup">
    //       <button className="auth-button">Sign Up</button>
    //     </Link>
    //   </div>

    //   {/* Image Section */}
    //   <div className="image-section">
    //     <div className="image-container">
    //       <img
    //         src="https://via.placeholder.com/800x400"
    //         alt="homepage"
    //         className="main-image"
    //       />
    //       <div className="image-description">
    //         Hover over the image to see the description.
    //       </div>
    //     </div>
    //   </div>

    //   {/* Bottom Buttons */}
    //   <div className="buttons-section">
    //     {["Button 1", "Button 2", "Button 3", "Button 4", "Button 5", "Button 6"].map((btn, index) => (
    //       <div
    //         key={index}
    //         className="button-container"
    //         onMouseEnter={() => setHover(index)}
    //         onMouseLeave={() => setHover(null)}
    //       >
    //         <button className="action-button">{btn}</button>
    //         {hover === index && <div className="button-description">Description for {btn}</div>}
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div>
      <Navbar />
      <JobCard />
      <Jobs />
    </div>
  );
};

export default Homepage;
