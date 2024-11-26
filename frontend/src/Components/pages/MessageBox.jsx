import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Trash2 } from 'lucide-react';

const MessageBox = ({
  userRole,
  adminProfileImage,
  userProfileImage,
  initialBatchName = 'Batch 2024',
  messageLinks = []
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState([]); // To store uploaded files (PDF, Excel)
  const [links, setLinks] = useState(messageLinks); // Links sent by Admin
  const [batchName, setBatchName] = useState(initialBatchName);

  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessage = {
      text: input,
      timestamp: new Date(),
      sender: userRole === 'admin' 
        ? { name: 'Admin', image: adminProfileImage } 
        : { name: 'User', image: userProfileImage },
    };

    setMessages([...messages, newMessage]);
    setInput('');
  };

  const handleDelete = (msgToDelete) => {
    setMessages(messages.filter((msg) => msg !== msgToDelete));
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const newFiles = uploadedFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));

    setFiles([...files, ...newFiles]);
  };

  const handleLinkSubmit = (event) => {
    event.preventDefault();
    const link = event.target.elements.link.value.trim();
    if (link) {
      setLinks([...links, { name: link, url: link }]);
      event.target.reset();
    }
  };

  const renderFileIcon = (fileType) => {
    if (fileType === 'application/pdf') {
      return <span className="text-red-600">📄</span>; // PDF Icon
    }
    if (fileType === 'application/vnd.ms-excel') {
      return <span className="text-green-600">📊</span>; // Excel Icon
    }
    return <span>📎</span>; // Default attachment icon
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e4d7] to-[#b49b59] flex flex-col md:flex-row items-center justify-center p-6">
      {/* Left Message Box Section */}
      <div className="flex-1 max-w-3xl p-6 bg-gradient-to-br from-[#d5a7c6] to-[#7c6c5b] rounded-xl shadow-lg text-white">
        {/* Profile Picture and Batch Name */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={userRole === 'admin' ? adminProfileImage : userProfileImage}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover shadow-md"
          />
          <div>
            <p className="text-xl font-semibold">{batchName}</p>
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
                      className={`p-3 rounded-2xl ${
                        userRole === 'admin'
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black' // Admin message style
                          : 'bg-gradient-to-r from-yellow-100 to-pink-200 text-black' // Student message style
                      } flex justify-between items-start`}
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
                      </div>
                      {userRole === 'admin' && ( // Only show delete icon if the user is admin
                        <button
                          className="ml-3 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(msg)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
          <div className="px-4 py-4">
            <Textarea
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="resize-none rounded-2xl w-full mb-4 bg-white text-black"
            />
            <Button
              onClick={handleSend}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl"
            >
              Send Message
            </Button>
          </div>
        </Card>
      </div>

      {/* Right Side Panel for Links & Files */}
      <div className="w-full md:w-1/4 bg-gradient-to-br from-[#e6e1d5] to-[#b6ab87] p-6 rounded-xl shadow-lg mt-8 md:mt-0 md:ml-8 text-black">
        <h3 className="text-xl font-bold mb-4 text-center">Admin Links & Files</h3>

        {/* Links Section */}
        <div className="mb-6">
          <h4 className="font-semibold text-lg">Links:</h4>
          {links.length === 0 ? (
            <p className="text-gray-500 text-center">No links available.</p>
          ) : (
            <ul className="space-y-4">
              {links.map((link, index) => (
                <li key={index} className="flex items-center gap-2">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Files Section */}
        <div className="mb-6">
          <h4 className="font-semibold text-lg">Uploaded Files:</h4>
          {files.length === 0 ? (
            <p className="text-gray-500 text-center">No files uploaded yet.</p>
          ) : (
            <ul className="space-y-4">
              {files.map((file, index) => (
                <li key={index} className="flex items-center gap-2">
                  {renderFileIcon(file.type)}
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Admin File Upload and Link Input */}
        {userRole === 'admin' && (
          <div>
            <form onSubmit={handleLinkSubmit}>
              <label htmlFor="link" className="block text-sm font-semibold">Add a Link</label>
              <input
                type="url"
                id="link"
                name="link"
                placeholder="Enter link URL"
                className="w-full p-2 rounded-lg border mt-2"
              />
              <Button
                type="submit"
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl"
              >
                Add Link
              </Button>
            </form>

            <div className="mt-4">
              <label htmlFor="file" className="block text-sm font-semibold">Upload a File</label>
              <input
                type="file"
                id="file"
                onChange={handleFileUpload}
                className="w-full mt-2"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
