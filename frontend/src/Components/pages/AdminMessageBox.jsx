import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Loader2 } from 'lucide-react';

const AdminMessageBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [importantMessages, setImportantMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to send a message
  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessage = {
      text: input,
      isImportant: input.toLowerCase().includes('important'),
      sender: 'Admin', // Admin is sending this message
    };

    setMessages([...messages, newMessage]);

    // If the message is important, add it to importantMessages
    if (newMessage.isImportant) {
      setImportantMessages([...importantMessages, newMessage]);
    }

    setInput(''); // Reset input field
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 via-teal-100 to-blue-100">
      {/* Message Box Card */}
      <Card className="w-full max-w-lg shadow-lg rounded-3xl">
        <CardHeader>
          <CardTitle className="text-center text-lg font-bold">Admin Message Box</CardTitle>
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
                      msg.isImportant ? 'bg-gradient-to-r from-yellow-300 to-yellow-400 text-black' : 'bg-gradient-to-r from-blue-300 to-blue-400 text-white'
                    }`}
                  >
                    <span className="font-bold">{msg.sender}:</span> {msg.text}
                    {msg.isImportant && (
                      <Badge className="ml-2 bg-yellow-500 text-black text-sm">Important</Badge>
                    )}
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
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="resize-none rounded-2xl"
          />
          <Button
            onClick={handleSend}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Message'}
          </Button>
        </CardFooter>
      </Card>

      {/* Important Messages Section */}
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
                  <li key={index} className="p-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
                    <span className="font-bold">{msg.sender}:</span> {msg.text}
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

export default AdminMessageBox;
