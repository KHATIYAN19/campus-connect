import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Trash2 } from 'lucide-react';

const MessageBox = ({ userRole, batchName = 'Batch 2024', profileImage = '/path-to-image.jpg' }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [importantMessages, setImportantMessages] = useState([]);

  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessage = {
      text: input,
      timestamp: new Date(),
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
    <div className="min-h-screen bg-gradient-to-br from-[#e4c9a8] to-[#b99c5c] flex flex-col items-center p-6">
      <div className="w-full max-w-4xl flex items-center mb-6">
        <div className="flex items-center">
          <img
            src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwO7ObL7LxewOC3tzo8iOSc6Kd_B21OtYyyg&s"}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover shadow-md"
          />
          <div className="ml-3">
            <p className="text-md font-bold text-gray-800">{batchName}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="shadow-lg rounded-2xl flex flex-col">
          <CardHeader>
            <CardTitle className="text-center text-lg font-bold">Message Box</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
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
                      } flex justify-between items-start`}
                    >
                      <div>
                        <p>{msg.text}</p>
                        <span className="text-xs text-gray-700">
                          {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                        </span>
                      </div>
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

        <Card className="shadow-lg rounded-2xl flex flex-col">
          <CardHeader>
            <CardTitle className="text-center text-lg font-bold">Important Messages</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ScrollArea className="h-full px-4">
              {importantMessages.length === 0 ? (
                <p className="text-gray-500 text-center">No important messages yet.</p>
              ) : (
                <ul className="space-y-4">
                  {importantMessages.map((msg, index) => (
                    <li
                      key={index}
                      className="p-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black flex justify-between items-start"
                    >
                      <div>
                        <p>{msg.text}</p>
                        <span className="text-xs text-gray-700">
                          {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                        </span>
                      </div>
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
        </Card>
      </div>
    </div>
  );
};

export default MessageBox;
