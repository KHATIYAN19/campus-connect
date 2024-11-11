import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import React from 'react'
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Link } from 'react-router-dom';
import login from '../LoginSignUp/Login';
import signup from '../LoginSignUp/Signup';

const Navbar = () => {
  const user = false;
  return (
    <div className='bg-white;'>
      <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
        <div>
          <h1 className='text-2xl font-bold text-white'>Campus<span className='text-[#c78c06]'>Connect</span></h1>
        </div>
        <div className='flex items-center gap-12'>
          <ul className='flex font-medium items-center gap-5'>
            <li>Home</li>
            <li><Link to='/Jobs'>Jobs</Link></li>
          </ul>
          {!user ? (
            <div className='flex items-center gap-2'>
              <Link to="/login"><Button variant="outline">Login</Button></Link>
              <Link to="/signup"><Button className="bg-[#c78c06] hover:bg-[#705820]">Signup</Button></Link>
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
                    <h4 className='font-medium'>Welcome to Campus Connect</h4>
                    <p className='text-sm text-muted-foreground'>Lorem ipsum dolor sit amet.</p>
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