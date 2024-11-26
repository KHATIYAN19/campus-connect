import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Trash2 } from 'lucide-react'; // Trash icon for deleting messages

const MessageBox = ({
  adminProfileImage,
  batchList = ['Batch 2024', 'Batch 2023'],
  initialBatchName = 'Batch 2024'
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [batchName, setBatchName] = useState(initialBatchName);

  // Handle sending a message
  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessage = {
      text: input,
      timestamp: new Date(),
      batchName,
      sender: { name: 'Admin', image: adminProfileImage, role: 'Admin' },
    };

    setMessages([...messages, newMessage]);
    setInput('');
  };

  // Handle deleting a message
  const handleDelete = (msgToDelete) => {
    setMessages(messages.filter((msg) => msg !== msgToDelete));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e4d7] to-[#b49b59] flex flex-col items-center justify-center p-6">
      {/* Left Message Box Section */}
      <div className="w-full max-w-3xl p-6 bg-gradient-to-br from-[#d5a7c6] to-[#7c6c5b] rounded-xl shadow-lg text-white">
        {/* Profile Picture and Batch Name with User Role */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={adminProfileImage}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover shadow-md"
          />
          <div>
            <p className="text-xl font-semibold">{batchName}</p>
            <p className="text-sm text-gray-300">Admin</p>
          </div>
        </div>

        {/* Message Box */}
        <Card className="shadow-lg rounded-2xl flex flex-col">
          <CardHeader>
            <CardTitle className="text-center text-lg font-bold">Message Box</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ScrollArea className="h-full px-4">
              {messages.length === 0 ? (
                <p className="text-gray-300 text-center">No messages yet. Start typing below!</p>
              ) : (
                <ul className="space-y-4">
                  {messages.map((msg, index) => (
                    <li
                      key={index}
                      className="p-3 rounded-2xl bg-gradient-to-r from-yellow-100 to-pink-200 text-black flex justify-between items-start"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={msg.sender.image}
                          alt={msg.sender.name}
                          className="w-8 h-8 rounded-full object-cover shadow-md"
                        />
                      </div>
                      <div className="flex-1 ml-3">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{msg.sender.name}</p>
                        </div>
                        <p>{msg.text}</p>
                        <span className="text-xs text-gray-700">
                          {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                        </span>
                        <button
                          className="ml-8 mt-3 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(msg)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>

          {/* Batch Selection for Admin */}
          <div className="mt-2 mb-2 ml-5">
            <label htmlFor="batchName" className="block text-sm font-semibold text-white">Select Batch</label>
            <select
              id="batchName"
              className="w-900 mt-2 p-2 rounded-2xl bg-white text-black shadow-lg text-sm"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
            >
              {batchList.map((batch, index) => (
                <option key={index} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
          </div>

          {/* Message Box Footer with Input */}
          <div className="px-4 py-4 flex items-center gap-4">
            <Textarea
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="resize-none rounded-2xl w-full bg-white text-black"
            />
          </div>

          <Button
            onClick={handleSend}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl mt-4"
          >
            Send Message
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default MessageBox;
