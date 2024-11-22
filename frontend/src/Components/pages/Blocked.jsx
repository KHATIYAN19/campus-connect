import React from "react"
import { useState, useEffect } from "react";
import { GrLinkNext } from "react-icons/gr";
import axios from "../LoginSignUp/axios.js";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx";
import { Input } from "../ui/input.jsx";
import { Button } from "../ui/button.jsx";
const Blocked = (props) => {
  const navigate = useNavigate();
  const [user, SetUser] = useState([]);
  const [email, setEmail] = useState('');
  useEffect(() => {
    axios.get("http://localhost:8080/blocked/allUser").then((res) => {
      console.log("data", res.data.data);
      SetUser(res.data.data);
    })
  }, []);
  const addHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/blocked/addUser', email);
      const signup = response.data.success;
      if (signup) {
        toast.warning(response.data.Data.name.toUpperCase() + " Verify your Account");
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {

      toast.error(error.response.data.message);
    }
  };
  async function deleteHandler(email) {
    try {
      const response = await axios.delete(`http://localhost:8080/blocked/deleteUser/${email}`);
      const res = response.data.success;
      if (res) {
        toast.warning("User Unblocked");
        SetUser(user.filter((user) => user.email !== email));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  return (
    <div className="my-10 w-full max-w-2xl mx-auto px-6">
      <Card>
        <CardHeader>
          <CardTitle>Block User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-gray-700">Enter the email address to block a user:</p>
          </div>
          <form
            action=""
            onSubmit={addHandler}
            className="flex items-center gap-4"
          >
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
  )
};
export default Blocked;
