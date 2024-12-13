import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { z } from 'zod';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import phone_icon from '../Assets/phone.png';
import password_icon from '../Assets/password.png';
import key_icon from '../Assets/key.webp';
import image_icon from '../Assets/photo.png';
import { Input } from '../ui/input';

// Zod validation schema for SignupAdmin form
const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  adminkey: z.string().min(5, "Admin key must be at least 5 characters"),
  image: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Image size must be less than 5MB",
  }),
});

const SignupAdmin = ({ setAdmin }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [adminkey, setAdminKey] = useState('');
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate form using Zod
    try {
      signupSchema.parse({ name, email, phone, password, adminkey, image });

      const data = new FormData();
      data.append('name', name);
      data.append('email', email);
      data.append('password', password);
      data.append('image', image);
      data.append('phone', phone);
      data.append('adminkey', adminkey);

      const response = await axios.post('http://localhost:8080/signup/admin', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const signup = response.data.success;
      if (signup) {
        toast.warning(response.data.Data.name.toUpperCase() + " Verify your Account");
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(formattedErrors);
      } else {
        toast.error(error.response?.data?.message || 'An error occurred.');
      }
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100 p-4'>
      <div className='w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg'>
        <div className='text-center text-2xl font-semibold text-[#88004c] mb-6'>
          Sign Up <span className='text-2xl text-gray-600'>(Admin)</span>
        </div>
        <form onSubmit={handleSignUp}>
          <div className='mb-4'>
            <div className='flex items-center border-b-2 border-gray-300'>
              <img src={user_icon} alt='user_icon' className='w-6 h-6 mr-2' />
              <input
                type='text'
                placeholder='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full p-2 border-none focus:outline-none'
              />
            </div>
            {errors.name && <p className='text-xs text-red-500 mt-2'>{errors.name}</p>}
          </div>

          <div className='mb-4'>
            <div className='flex items-center border-b-2 border-gray-300'>
              <img src={email_icon} alt='email_icon' className='w-6 h-6 mr-2' />
              <input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full p-2 border-none focus:outline-none'
              />
            </div>
            {errors.email && <p className='text-xs text-red-500 mt-2'>{errors.email}</p>}
          </div>

          <div className='mb-4'>
            <div className='flex items-center border-b-2 border-gray-300'>
              <img src={phone_icon} alt='phone_icon' className='w-6 h-6 mr-2' />
              <input
                type='tel'
                placeholder='Phone'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className='w-full p-2 border-none focus:outline-none'
              />
            </div>
            {errors.phone && <p className='text-xs text-red-500 mt-2'>{errors.phone}</p>}
          </div>

          <div className='mb-4'>
            <div className='flex items-center border-b-2 border-gray-300'>
              <img src={password_icon} alt='password_icon' className='w-6 h-6 mr-2' />
              <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full p-2 border-none focus:outline-none'
              />
            </div>
            {errors.password && <p className='text-xs text-red-500 mt-2'>{errors.password}</p>}
          </div>

          <div className='mb-4'>
            <div className='flex items-center border-b-2 border-gray-300'>
              <img src={key_icon} alt='key_icon' className='w-6 h-6 mr-2' />
              <input
                type='text'
                placeholder='Admin Key'
                value={adminkey}
                onChange={(e) => setAdminKey(e.target.value)}
                className='w-full p-2 border-none focus:outline-none'
              />
            </div>
            {errors.adminkey && <p className='text-xs text-red-500 mt-2'>{errors.adminkey}</p>}
          </div>

          <div className='mb-6'>
            <div className='flex items-center'>
              <img src={image_icon} alt='image_icon' className='w-6 h-6 mr-2' />
              <Input
                accept='image/*'
                type='file'
                className='cursor-pointer w-full p-2 border-none focus:outline-none'
                onChange={handleImageChange}
              />
            </div>
            {errors.image && <p className='text-xs text-red-500 mt-2'>{errors.image}</p>}
          </div>

          <div className='text-sm flex items-center gap-2 my-4'>
            <p className='text-gray-700'>Click here for signup</p>
            <div
              className='text-red-600 cursor-pointer font-semibold'
              onClick={() => setAdmin(false)}
            >
              Student
            </div>
          </div>

          <div className='flex justify-center items-center'>
            <button
              type='submit'
              className='w-full bg-[#88004c] text-lg rounded-xl py-2 text-white font-bold hover:bg-blue-700 focus:outline-none'
            >
              Submit
            </button>
          </div>

          <div className='text-center mt-4'>
            <NavLink to='/login' className='text-gray-600 text-sm'>
              Already have an account? <span className='text-[#88004c] font-semibold'>Login</span>
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupAdmin;
