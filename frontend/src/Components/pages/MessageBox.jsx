import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Trash2 } from 'lucide-react'; // Trash icon for deleting messages

const MessageBox = (props) => {
  const [messages, setMessages] = useState();
  const [batch, setBatch] = useState();
  const [link, setLink] = useState();

  return (
    <div className='flex w-full  items-center overscroll-x-none justify-center h-screen '>
         <div className='border'>
             <h2>Send Message to Student</h2>
                <form action="">
                    <div className='flex flex-col'>
                     <div>
                      <label htmlFor="batch">Batch:</label>
                      <input className=' mx-2   w-16 px-2 py-1 border rounded-md	' type="text" placeholder='2025' id='batch' />
                      <label htmlFor="Link">Link:</label>
                      <input type="text" placeholder='' id='Link' />
                     </div>
                      <label htmlFor="message">Message:</label>
                      <textarea className='my-2 px-2 py-2 border rounded-lg' type="text" placeholder='Enter your message..' id='message' />
                    </div>
                </form>
         </div>
        
          
    </div>
  )
};
export default MessageBox;
