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
      <div className="min-h-screen bg-gray-100 p-8">
        {Array.isArray(messages) && messages.length === 0 ? (
          // Render when there are no messages
          <div className="text-center text-gray-500 text-lg">
            No Notices to display for your batch
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {messages.map((msg, index) => (
              <MessageComponent
                key={index}
                userImage={msg.postby?.image}
                userName={msg.postby?.name}
                collegeName={`Gl Bajaj`}
                message={msg.msg}
                batch={msg.year}
                timeAgo={calculateDaysAgo(msg.createdAt)}
                link={msg.postby?.image}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
