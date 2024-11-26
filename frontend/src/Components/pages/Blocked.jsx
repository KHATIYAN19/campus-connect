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
        { email } // Ensure correct payload structure
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
    <div className="my-10 w-full max-w-2xl mx-auto px-6">
      {/* Block User Form */}
      <Card>
        <CardHeader>
          <CardTitle>Block User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-gray-700">Enter the email address to block a user:</p>
          </div>
          <form onSubmit={addHandler} className="flex items-center gap-4">
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full max-w-md rounded-lg"
            />
            <Button
              type="submit"
              className="rounded-full w-9 h-9 flex items-center justify-center p-0 bg-yellow-600"
            >
              <GrLinkNext size={20} />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Blocked Users List */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>All Blocked Users</CardTitle>
        </CardHeader>
        <CardContent>
          {user.length === 0 ? (
            <p className="text-gray-600 text-center">No blocked users found.</p>
          ) : (
            <div className="space-y-4">
              {user.map((item, idx) => (
                <div
                  key={item.email}
                  className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <p className="font-medium">{idx + 1}.</p>
                    <p className="text-gray-700">{item.email}</p>
                  </div>
                  <Button
                    variant="destructive"
                    className="p-2"
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
