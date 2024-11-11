import React from 'react'
import { Button } from '../ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from '../ui/avatar'

const JobDetails = () => {
    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>
                <p>2 days ago</p>
                <Button variant='outline' className='rounded-full size=icon'><Bookmark /></Button>
            </div>
            <div className='flex items-center gap-2 my-2'>
                <Button>
                    <Avatar>
                        <AvatarImage src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"/>
                    </Avatar>
                </Button>
                <div>
                    <h1>Company Name</h1>
                    <p>India</p>
                </div>
            </div>
            <div className=''>
                <h1 className='font-bold text-lg my-2'>Title</h1>
                <p className='text-sm text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
        </div>
    )
}

export default JobDetails