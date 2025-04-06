import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Edit, X, User, Mail, Phone, Briefcase, GraduationCap, BookOpen, FileText, MapPin } from "lucide-react";
import axios from "../LoginSignUp/axios";

export default function UserUpdate() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/alluserinfo"); 
        setUserInfo(res.data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (search.length > 0) {
      const filtered = userInfo.filter((user) =>
        user.email.toLowerCase().includes(search.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [search, userInfo]);

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setSelectedUser(null);
  };

  const handleSelect = async (user) => {
    try {
      const response = await axios.post("http://localhost:8080/getuserinfo", {
        email: user.email
      });
      console.log("response",response)
      setSelectedUser(response.data.user);
      setSearch(user.email);
      setSuggestions([]);
      setEditMode(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert("Error loading user details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("profile.")) {
      const field = name.split(".")[1];
      setSelectedUser({
        ...selectedUser,
        profile: {
          ...selectedUser.profile,
          [field]: value,
        },
      });
    } else {
      setSelectedUser({ ...selectedUser, [name]: value });
    }
  };

  const FieldIcon = ({ name }) => {
    const icons = {
      name: User,
      email: Mail,
      phone: Phone,
      role: Briefcase,
      year: GraduationCap,
      maxoffer: BookOpen,
      bio: User,
      address: MapPin,
      graduationdegree: GraduationCap,
      graduationMarks: BookOpen,
      tenth: BookOpen,
      tweleth: BookOpen,
      resume: FileText,
    };
    
    const IconComponent = icons[name] || User;
    return <IconComponent className="h-4 w-4 text-purple-500" />;
  };

  return (
    <div className="p-6 w-full max-w-7xl mx-auto space-y-6">
      {/* Search Section */}
      <div className="space-y-4">
        <div className="relative w-full">
          <Input
            className="pl-12 pr-4 py-6 rounded-xl border-2 border-purple-100 focus:border-purple-500 text-lg"
            placeholder="Search user by email..."
            value={search}
            onChange={handleInputChange}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-purple-400" />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
          >
            {suggestions.map((user) => (
              <div
                key={user.email}
                className="flex items-center gap-4 p-4 bg-white hover:bg-purple-50 cursor-pointer rounded-xl border border-purple-100"
                onClick={() => handleSelect(user)}
              >
                <Avatar className="h-14 w-14">
                  <AvatarImage src={user.image} />
                  <AvatarFallback className="bg-purple-100 text-2xl">
                    {user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold text-purple-900">{user.name}</p>
                  <p className="text-sm text-purple-500">{user.email}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {search && suggestions.length === 0 && (
          <div className="p-4 text-center text-purple-600 bg-purple-50 rounded-xl">
            No user found
          </div>
        )}
      </div>

      {/* User Details */}
      {selectedUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <Card className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-25 shadow-lg">
            <CardContent className="p-8">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={selectedUser.image} />
                    <AvatarFallback className="text-3xl bg-purple-100">
                      {selectedUser.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-3xl font-bold text-purple-900">
                      {selectedUser.name}
                    </h2>
                    <p className="text-purple-600">{selectedUser.role}</p>
                  </div>
                </div>
                <Button
                  size="lg"
                  variant={editMode ? "secondary" : "default"}
                  className="gap-2 rounded-xl px-6 py-5 text-lg"
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? <X size={20} /> : <Edit size={20} />}
                  {editMode ? "Cancel Editing" : "Edit Profile"}
                </Button>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6 p-6 bg-white rounded-xl border border-purple-100">
                  <h3 className="text-xl font-semibold text-purple-900 flex items-center gap-2">
                    <User className="text-purple-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries({
                      name: "Full Name",
                      email: "Email Address",
                      phone: "Phone Number",
                      role: "User Role",
                      year: "Graduation Year",
                      maxoffer: "Max Offer (LPA)"
                    }).map(([field, label]) => (
                      <div key={field} className="space-y-2">
                        <div className="flex items-center gap-2 text-purple-600">
                          <FieldIcon name={field} />
                          <span className="text-sm font-medium">{label}</span>
                        </div>
                        {editMode ? (
                          <Input
                            name={field}
                            value={selectedUser[field]}
                            onChange={handleChange}
                            className="border-purple-200 text-purple-900"
                            disabled={field === 'email'}
                          />
                        ) : (
                          <p className="text-purple-900 p-2 bg-purple-50 rounded-lg">
                            {selectedUser[field]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profile Details */}
                <div className="space-y-6 p-6 bg-white rounded-xl border border-purple-100">
                  <h3 className="text-xl font-semibold text-purple-900 flex items-center gap-2">
                    <FileText className="text-purple-600" />
                    Academic Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(selectedUser.profile).map(([field, value]) => (
                      <div key={field} className="space-y-2">
                        <div className="flex items-center gap-2 text-purple-600">
                          <FieldIcon name={field} />
                          <span className="text-sm font-medium capitalize">
                            {field === 'tweleth' ? '12th Marks' : 
                             field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                        </div>
                        {editMode ? (
                          field === 'bio' ? (
                            <textarea
                              name={`profile.${field}`}
                              value={value}
                              onChange={handleChange}
                              className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 h-24"
                            />
                          ) : (
                            <Input
                              name={`profile.${field}`}
                              value={value}
                              onChange={handleChange}
                              className="border-purple-200 text-purple-900"
                              type={field === 'resume' ? 'url' : 'text'}
                            />
                          )
                        ) : (
                          <p className="text-purple-900 p-2 bg-purple-50 rounded-lg">
                            {value || '-'}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {editMode && (
                <div className="mt-8 flex justify-end gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-purple-600 border-purple-300 px-8 py-5 text-lg"
                    onClick={() => setEditMode(false)}
                  >
                    Discard Changes
                  </Button>
                  <Button
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700 px-8 py-5 text-lg"
                    onClick={() => alert("Updated Successfully!")}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}