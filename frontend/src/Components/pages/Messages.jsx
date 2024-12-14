import React, { useEffect, useState } from "react";
import axios from "../LoginSignUp/axios";
import MessageComponent from "./MessageComponent";

const Messages = ({show}) => {
  const role = localStorage.getItem("role");
  let [messages, setMessages] = useState([]); // Initialize as an empty array

  useEffect(() => {
    axios
      .get("http://localhost:8080/message/getall")
      .then((res) => {
        console.log("Response", res.data.messages);
        setMessages(res.data.messages || []); // Ensure a fallback to an empty array
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
        setMessages([]); // Fallback to empty array on error
      });
  }, []);

  const calculateDaysAgo = (createdDate) => {
    const currentDate = new Date(); // Get current date
    const createdDateObj = new Date(createdDate); // Convert createdAt to a Date object
    const diffInTime = currentDate - createdDateObj; // Difference in milliseconds
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24)); // Convert to days
    return diffInDays;
  };
   messages = !show ? messages.slice(0, 2) : messages;
   return (
    <div>
  <div className="min-h-screen bg-[#fff9e7] p-4 sm:p-8 rounded-xl">
    {Array.isArray(messages) && messages.length === 0 ? (
      // Render when there are no messages
      <div className="text-center text-gray-500 text-lg">
        No Notices to display for your batch
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
        {/* Heading for Latest Notices */}
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-yellow-800 mb-6">
          Latest Notices
        </h2>

        {/* Render messages */}
        {messages.map((msg, index) => (
          <div
            key={index}
            // className="bg-[#f5f5d1] shadow-xl p-4 sm:p-6 rounded-2xl hover:scale-105 transition-transform duration-300"
          >
            <MessageComponent
              userImage={msg.postby?.image}
              userName={msg.postby?.name}
              collegeName={`Gl Bajaj`}
              message={msg.msg}
              batch={msg.year}
              timeAgo={calculateDaysAgo(msg.createdAt)}
              link={msg.postby?.image}
            />
          </div>
        ))}
      </div>
    )}
  </div>
</div>

  );
  
};

export default Messages;
