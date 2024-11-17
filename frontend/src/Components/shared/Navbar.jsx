import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import React from 'react'
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import login from '../LoginSignUp/Login';
import signup from '../LoginSignUp/Signup';
import { LogOut, Trash2, User2 } from 'lucide-react';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isLogin=localStorage.getItem('isLogin');
  const role=localStorage.getItem('role');
  const navigate=useNavigate();
  const logoutHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:8080/logout');
      const logout=response;
      console.log(response);
      if(logout){
          localStorage.removeItem("isLogin");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
           toast.success("Logout Successfully");
           navigate("/login");
      }else{
       toast.error(response.data.message);
      }
  } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
  }
  }
  return (
    
    <div className='bg-white;'>
      
      <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
      <div className='flex items-centre gap-2'>
          <Avatar className='w-10 h-10'>
              <AvatarImage src="https://cdn-icons-png.flaticon.com/128/12372/12372496.png" alt="@shadcn" />
          </Avatar>
          <h1 className='text-4xl font-bold text-black font-serif'>Placement<span className='text-[#c78c06]'>Connect</span></h1>
        </div>
        <div className='flex items-center gap-12'>
          <ul className='flex font-medium items-center gap-5'>
            <Link to='/'>Home</Link>
            <Link to='/Jobs'>Jobs</Link>
            {role==='admin'?(<Link to='/jobs/post'>Post-a-drive</Link>):(<></>)}
            
          </ul>
          {!user ? (
            <div className='flex items-center gap-2'>
              <Link to="/login"><Button variant="outline" className='rounded'>Login</Button></Link>
              <Link to="/signup"><Button className="bg-[#c78c06] hover:bg-[#705820] rounded">Signup</Button></Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className='cursor-pointer'>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className='w-80'>
                <div className='flex gap-4 space-y-2'>
                  <Avatar className='cursor-pointer'>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  </Avatar>
                  <div>
                    <h4 className='text-sm font-bold'>Welcome to Placement Connect</h4>
                    <p className='text-sm text-muted-foreground font-normal'>Hey  {user.name}</p>
                  </div>
                </div>
                <div className='flex flex-col my-2 text-gray-600'>
                  <div className='flex w-fit items-center gap-2 cursor-pointer'>
                    <User2/>
                  <Button variant='link'><Link to='/profile'>View Profile</Link></Button>
                  </div>
                  <div className='flex w-fit items-center gap-2 cursor-pointer'>
                    <LogOut/>
                  <Button variant='link' onClick={logoutHandler}>Logout</Button>
                  </div>
                  <div className='flex w-fit items-center gap-2 cursor-pointer'>
                    <Trash2/>
                  <Button variant='link'>Delete</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )
          }
        </div>
      </div>
    </div>
  )
}

export default Navbar;