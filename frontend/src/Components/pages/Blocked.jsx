import React, { useState, useEffect } from "react";
import { GrLinkNext } from "react-icons/gr";
import axios from "../LoginSignUp/axios.js";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx";
import { Input } from "../ui/input.jsx";
import { Button } from "../ui/button.jsx";
import { ImSpinner8 } from "react-icons/im";

const Blocked = () => {
  const [user, SetUser] = useState([]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingEmail, setDeletingEmail] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/blocked/allUser")
      .then((res) => {
        SetUser(res.data.data);
        setIsLoading(false);
      })
      .catch(() => {
        toast.error("Failed to fetch blocked users.");
        setIsLoading(false);
      });
  }, []);

  const addHandler = async (e) => {
    e.preventDefault();
    if (!email) return toast.warning("Please enter an email address.");
    
    setIsAdding(true);
    try {
      const { data } = await axios.post("http://localhost:8080/blocked/addUser", { email });
      if (data.success) {
        toast.success("User blocked successfully.");
        setEmail("");
        SetUser(prev => [...prev, { email }]);
      }
    }catch (e) { 
      toast.error(e?.response?.data?.message);
    }
     finally {
      setIsAdding(false);
    }
  };

  const deleteHandler = async (email) => {
    setDeletingEmail(email);
    try {
      const { data } = await axios.delete(`http://localhost:8080/blocked/deleteUser/${email}`);
      if (data.success) {
        toast.success("User unblocked successfully.");
        SetUser(prev => prev.filter(user => user.email !== email));
      }
    } finally {
      setDeletingEmail(null);
    }
  };

  return (
    <div className="my-10 w-full max-w-4xl mx-auto px-6 animate-fade-in">
      <Card className="bg-gradient-to-br from-teal-600 via-cyan-600 to-emerald-600 shadow-2xl rounded-2xl border-0">
        <CardHeader>
          <CardTitle className="text-white text-xl font-bold tracking-tighter drop-shadow-md">
            Block User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addHandler} className="flex items-center gap-3">
            <Input
              type="email"
              placeholder="Enter email to block"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-teal-50/80 backdrop-blur-sm border-0 text-teal-900 placeholder-teal-700/60 rounded-xl h-12 focus-visible:ring-2 focus-visible:ring-teal-200 ring-offset-1"
            />
            <Button
              type="submit"
              disabled={isAdding}
              className="h-12 w-12 p-0 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-teal-500/30"
            >
              {isAdding ? (
                <ImSpinner8 className="animate-spin text-white w-5 h-5" />
              ) : (
                <GrLinkNext className="text-white w-5 h-5" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-8 bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl border border-teal-100/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-teal-900">
            Blocked Users
            <span className="ml-2 text-teal-600/80 font-normal text-sm">
              ({user.length} {user.length === 1 ? 'entry' : 'entries'})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <ImSpinner8 className="animate-spin text-teal-600 w-8 h-8" />
            </div>
          ) : user.length === 0 ? (
            <div className="text-center py-6 space-y-4">
              <div className="text-teal-700/50 text-lg">No blocked users found</div>
            </div>
          ) : (
            <div className="space-y-3">
              {user.map((item, idx) => (
                <div key={item.email} className="group flex items-center justify-between p-4 bg-teal-50/50 hover:bg-teal-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="flex items-center space-x-4">
                    <div className="text-teal-600/80 font-mono">{idx + 1}.</div>
                    <div className="text-teal-900 font-medium">{item.email}</div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => deleteHandler(item.email)}
                    disabled={deletingEmail === item.email}
                    className="p-2 hover:bg-red-100/50 rounded-lg transition-colors duration-200"
                  >
                    {deletingEmail === item.email ? (
                      <ImSpinner8 className="animate-spin text-teal-600 w-5 h-5" />
                    ) : (
                      <MdDelete className="text-teal-500/80 w-5 h-5 hover:text-teal-600 transition-colors" />
                    )}
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