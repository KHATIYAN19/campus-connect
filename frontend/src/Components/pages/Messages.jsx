import React from "react"
import MessageComponent from "./MessageComponent";
const Messages = (props) => {
    const messages = [
        {
          userImage: "https://via.placeholder.com/150",
          userName: "John Doe",
          collegeName: "Harvard University",
          message: "This is message 1 from John Doe.",
          batch: "2025",
          timeAgo: "2 days ago",
          link: "https://example.com/1",
        },
        {
          userImage: "https://via.placeholder.com/150",
          userName: "Jane Smith",
          collegeName: "Stanford University",
          message: "This is message 2 from Jane Smith.",
          batch: "2026",
          timeAgo: "3 days ago",
          link: "https://example.com/2",
        },
        // Add 5 more objects with unique data for demonstration
        {
          userImage: "https://via.placeholder.com/150",
          userName: "Alice Johnson",
          collegeName: "MIT",
          message: "This is message 3 from Alice Johnson.",
          batch: "2024",
          timeAgo: "4 days ago",
          link: "https://example.com/3",
        },
        {
          userImage: "https://via.placeholder.com/150",
          userName: "Bob Brown",
          collegeName: "Yale University",
          message: "This is message 4 from Bob Brown.",
          batch: "2023",
          timeAgo: "5 days ago",
          link: "https://example.com/4",
        },
        {
          userImage: "https://via.placeholder.com/150",
          userName: "Clara Lee",
          collegeName: "Columbia University",
          message: "This is message 5 from Clara Lee.",
          batch: "2025",
          timeAgo: "6 days ago",
          link: "https://example.com/5",
        },
        {
          userImage: "https://via.placeholder.com/150",
          userName: "David Kim",
          collegeName: "Princeton University",
          message: "This is message 6 from David Kim.",
          batch: "2022",
          timeAgo: "1 week ago",
          link: "https://example.com/6",
        },
        {
          userImage: "https://via.placeholder.com/150",
          userName: "Ella Adams",
          collegeName: "Dartmouth College",
          message: "This is message 7 from Ella Adams.",
          batch: "2027",
          timeAgo: "8 days ago",
          link: "https://example.com/7",
        },
      ];
  return (
    <div>
        <div className="min-h-screen bg-gray-100 p-8">
    {/* Grid with a single column */}
    <div className="grid grid-cols-1 gap-6">
      {messages.map((msg, index) => (
        <MessageComponent
          key={index}
          userImage={msg.userImage}
          userName={msg.userName}
          collegeName={msg.collegeName}
          message={msg.message}
          batch={msg.batch}
          timeAgo={msg.timeAgo}
          link={msg.link}
        />
      ))}
    </div>
  </div>
    </div>
  )
};

export default Messages;
