import React from "react";
import { Badge } from "../ui/badge";
import { NavLink } from "react-router-dom";
import { Avatar, AvatarImage } from "../ui/avatar";

const LatestJobs = ({ data }) => {
  return (
    <div className="p-6 shadow-lg  bg-white border border-gray-200 cursor-pointer hover:shadow-xl transition-transform transform hover:-translate-y-1 mt-5 rounded-xl">
      <NavLink to={`/description/${data._id}`} className="block">
        {/* Header with Avatar and Company Info */}
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-14 h-14">
            <AvatarImage src={data.logo} alt={`${data.company} logo`} />
          </Avatar>
          <div>
            <h1 className="font-semibold text-xl text-gray-800">
              {data.company}
            </h1>
            <p className="text-sm text-gray-500">India</p>
          </div>
        </div>

        {/* Job Details */}
        <div>
          <h2 className="font-bold text-lg text-gray-900 mb-2">
            {data.position}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {data.description.length > 100
              ? `${data.description.substring(0, 100)}...`
              : data.description}
          </p>
        </div>

        {/* Badges Section */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <Badge className="bg-yellow-100 text-yellow-700 font-semibold px-3 py-1 rounded-md">
            {data.numbers} Positions
          </Badge>
          <Badge className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-md">
            {data.position}
          </Badge>
          <Badge className="bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-md">
            ₹{data.salary} per annum
          </Badge>
        </div>
      </NavLink>
    </div>
  );
};

export default LatestJobs;
