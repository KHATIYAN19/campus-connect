import React from 'react';
import { useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from "../LoginSignUp/axios"
import { Link } from 'react-router-dom';
const UserProfile = () => {

  
  const { id } = useParams();
  const [user,setUser]=useState('');
  const role=localStorage.getItem('role');
  const fetchUser = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/user/profile/${id}`);
        setUser(response.data.user);
      
    } catch (error) {
        console.error('Error fetching job details:', error);
    }
};
  useEffect(() => {
    fetchUser();
    console.log("user",user);
  }, []);
 
  const handleOpenResume = () => {
    if (user?.profile?.resume) {
      // Open the resume in a new tab
      const formattedUrl = user.profile.resume.replace("/view?usp=sharing", "/preview");
      window.open(formattedUrl, "_blank");
    } else {
      alert("No resume link found!");
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto my-10 " >
      {/* User Image */}
      <div className="flex flex-col items-center">
        <img
          src={user.image}
          alt="User"
          className="w-32 h-32 rounded-full border-4 border-blue-500"
        />
        <h1 className="text-2xl font-bold text-blue-600 mt-4">{user.name} <span className='text-sm text-red-300 opacity-50'>{user.role}</span></h1>
        <p className="text-gray-600 italic mt-2 text-center">{(user?.profile?.bio||"I am Glbians")}</p>
      </div>
      <hr className="my-6 border-gray-300" />
      {/* User Details */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Personal Details</h2>
        <div className="flex flex-col space-y-2">
          <p>
            <span className="font-medium text-gray-700">College:</span>{" "}
            <span className="text-blue-600">GL BAJAJ INSTITUTE OF TECHNOLOGY AND MANAGEMENT</span>
          </p>
          {
            user.role==='student'?(<><p>
              <span className="font-medium text-gray-700">10th Marks:</span>{" "}
              <span className="text-blue-600">{user?.profile?.tenth}</span>
            </p>
            <p>
              <span className="font-medium text-gray-700">12th Marks:</span>{" "}
              <span className="text-blue-600">{user?.profile?.tweleth}</span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Graduation Degree:</span>{" "}
              <span className="text-blue-600">{user?.profile?.graduationdegree}</span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Graduation Marks:</span>{" "}
              <span className="text-blue-600">{user?.profile?.graduationMarks}</span>
            </p>

            <p>
              <span className="font-medium text-gray-700">Resume: </span>{" "}
              <span className="text-blue-600 cursor-pointer " >{user?.profile?.resume}</span>
            </p>
            <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleOpenResume}
      >
        View Resume
      </button>

         </>):(<></>)
          }
        </div>
      </div>
        
      <hr className="my-6 border-gray-300" />

      {/* Contact Information */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Contact Information</h2>
        <div className="flex flex-col space-y-2">
          <p>
            <span className="font-medium text-gray-700">Email:</span>{" "}
            <span className="text-blue-600">{user.email}</span>
          </p>
          <p>
            <span className="font-medium text-gray-700">Phone:</span>{" "}
            <span className="text-blue-600">{user.phone}</span>
          </p>
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

    
    </div>
  );
};

export default UserProfile;
