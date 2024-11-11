import React from 'react'
import { Button } from '../ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'

const JobDetails = () => {
    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>2 days ago</p>
                <Button variant='outline' className='rounded-full size=icon'><Bookmark /></Button>
            </div>
            <div className='flex items-center gap-2 my-2'>
                <Button className='p-6' variant='outline' size='icon'>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='text-lg font-medium'>Company Name</h1>
                    <p className='text-sm text-gray-500'>India</p>
                </div>
            </div>
            <div className=''>
                <h1 className='font-bold text-lg my-2'>Title</h1>
                <p className='text-sm text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className="text-yellow-600 font-bold" variant='ghost'>12 Positions</Badge>
                <Badge className="text-yellow-600 font-bold" variant='ghost'>Intership</Badge>
                <Badge className="text-yellow-600 font-bold" variant='ghost'>24Lpa</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <Button variant="outline">Details</Button>
                <Button className='bg-yellow-700'>Save for later</Button>
            </div>
        </div>
    )
}

export default JobDetails