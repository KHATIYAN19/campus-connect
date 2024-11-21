import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Trash2 } from 'lucide-react';

const MessageBox = ({ userRole }) => {
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState('');         
  const [importantMessages, setImportantMessages] = useState([]); 

  // Function to send a message
  const handleSend = () => {
    if (input.trim() === '') return;  

    
    const newMessage = {
      text: input,
      isImportant: input.toLowerCase().includes('important') || userRole === 'admin',
    };

    setMessages([...messages, newMessage]);

    if (newMessage.isImportant) {
      setImportantMessages([...importantMessages, newMessage]);
    }

    setInput(''); 
  };


  const handleDelete = (msgToDelete) => {
    setMessages(messages.filter((msg) => msg !== msgToDelete));

    if (msgToDelete.isImportant) {
      setImportantMessages(importantMessages.filter((msg) => msg !== msgToDelete));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Card className="w-full max-w-lg shadow-lg rounded-3xl">
        <CardHeader>
          <CardTitle className="text-center text-lg font-bold">Message Box</CardTitle>
        </CardHeader>
        <CardContent className="h-64 overflow-hidden">
          <ScrollArea className="h-full px-4">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">No messages yet. Start typing below!</p>
            ) : (
              <ul className="space-y-4">
                {messages.map((msg, index) => (
                  <li
                    key={index}
                    className={`p-3 rounded-2xl ${
                      msg.isImportant
                        ? 'bg-gradient-to-r from-yellow-300 to-yellow-400 text-black' 
                        : 'bg-gradient-to-r from-purple-300 to-purple-400 text-white'
                    } flex justify-between items-center`}
                  >
                    {msg.text}
                    <button
                      className="ml-3 text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(msg)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Label htmlFor="message" className="text-sm font-semibold">
            Your Message
          </Label>
          <Textarea
            id="message"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="resize-none rounded-2xl"
          />
          <Button
            onClick={handleSend}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl"
          >
            Send Message
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8 w-full max-w-lg mx-auto">
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center text-lg font-bold">Important Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {importantMessages.length === 0 ? (
              <p className="text-gray-500 text-center">No important messages yet.</p>
            ) : (
              <ul className="space-y-4">
                {importantMessages.map((msg, index) => (
                  <li
                    key={index}
                    className="p-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black flex justify-between items-center"
                  >
                    {msg.text}
                    <button
                      className="ml-3 text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(msg)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessageBox;
