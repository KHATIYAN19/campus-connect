import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import React from 'react'
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const user = false;
  return (
    <div className='bg-white;'>
      <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
        <div className="flex items-center gap-3">
          <Avatar className='w-10 h-10'>
              <AvatarImage src="https://cdn-icons-png.flaticon.com/128/12372/12372496.png" alt="@shadcn" />
          </Avatar>
          <h1 className='text-4xl font-bold text-black font-serif'>Campus<span className='text-[#c78c06]'>Connect</span></h1>
        </div>
        <div className='flex items-center gap-12'>
          <ul className='flex font-medium items-center gap-5'>
            <li>Home</li>
            <Link to='/Jobs'>Jobs</Link>
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