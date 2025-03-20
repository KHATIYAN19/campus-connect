import React, { useEffect, useState } from "react";
import axios from "../LoginSignUp/axios";
import MessageComponent from "./MessageComponent";
import { FaBullhorn } from "react-icons/fa";

const Messages = ({ show }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/message/getall")
      .then((res) => {
        setMessages(res.data.messages || []);
      })
      .catch(console.error);
  }, []);

  const calculateDaysAgo = (createdDate) => {
    return Math.floor(new Date() - new Date(createdDate)) / (1000 * 3600 * 24);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8 sm:mb-12">
          <FaBullhorn className="text-3xl sm:text-4xl text-indigo-600" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Placement Notice Board
          </h2>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg">No notices available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <MessageComponent
                key={index}
                topic={msg.topic || "General Notice"}
                userImage={msg.postby?.image}
                userName={msg.postby?.name}
                collegeName="GL Bajaj Institute"
                message={msg.msg}
                batch={msg.year}
                timeAgo={Math.floor(calculateDaysAgo(msg.createdAt))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;