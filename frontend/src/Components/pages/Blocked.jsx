import React, { useState, useEffect } from "react";
import { GrLinkNext } from "react-icons/gr";
import axios from "../LoginSignUp/axios.js";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx";
import { Input } from "../ui/input.jsx";
import { Button } from "../ui/button.jsx";

const Blocked = () => {
  const navigate = useNavigate();
  const [user, SetUser] = useState([]);
  const [email, setEmail] = useState("");

  // Fetch all blocked users on component mount
  useEffect(() => {
    axios
      .get("http://localhost:8080/blocked/allUser")
      .then((res) => {
        SetUser(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching blocked users:", error);
        toast.error("Failed to fetch blocked users.");
      });
  }, []);

  // Handler to add a blocked user
  const addHandler = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.warning("Please enter an email address.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/blocked/addUser",
        { email }
      );

      const signup = response.data.success;
      if (signup) {
        toast.success("User blocked successfully.");
        setEmail(""); // Clear input field
        SetUser((prevUsers) => [...prevUsers, { email }]); // Update UI
      } else {
        toast.error(response.data.message || "Failed to block the user.");
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  // Handler to delete/unblock a user
  const deleteHandler = async (email) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/blocked/deleteUser/${email}`
      );

      if (response.data.success) {
        toast.success("User unblocked successfully.");
        SetUser((prevUsers) => prevUsers.filter((user) => user.email !== email)); // Update UI
      } else {
        toast.error(response.data.message || "Failed to unblock the user.");
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="my-10 w-full max-w-4xl mx-auto px-6">
      {/* Block User Form */}
      <Card className="bg-gradient-to-r from-[#cc0079] via-[#99005b] to-purple-800 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-white text-lg font-semibold">Block User</CardTitle>
        </CardHeader>
        <CardContent className="text-white">
          <div className="mb-4">
            <p className="text-gray-200 text-md">Enter the email address to block a user :</p>
          </div>
          <form onSubmit={addHandler} className="flex items-center gap-4">
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full max-w-md rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              className="rounded-full w-10 h-10 flex items-center justify-center p-0 bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 transition"
            >
              <GrLinkNext size={20} />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Blocked Users List */}
      <Card className="mt-8 bg-gray-100 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">All Blocked Users</CardTitle>
        </CardHeader>
        <CardContent>
          {user.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">No blocked users found.</p>
          ) : (
            <div className="space-y-4">
              {user.map((item, idx) => (
                <div
                  key={item.email}
                  className="flex items-center justify-between p-4 bg-white rounded-xl shadow hover:shadow-lg transition-all ease-in-out duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center gap-4 ">
                    <p className="font-semibold text-lg text-gray-800">{idx + 1}.</p>
                    <p className="text-gray-700 text-md">{item.email}</p>
                  </div>
                  <Button
                    variant="destructive"
                    className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition duration-200"
                    onClick={() => deleteHandler(item.email)}
                  >
                    <MdDelete size={20} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Blocked;
