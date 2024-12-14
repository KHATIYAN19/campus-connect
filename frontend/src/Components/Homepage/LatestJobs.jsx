import React from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';


const LatestJobs = ({ data }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col h-full">
      <NavLink to={`/description/${data._id}`} className="block h-full">
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
        <div className="flex-1">
          <h2 className="font-bold text-lg text-gray-900 mb-2">
            {data.position.length > 25 ? `${data.position.substring(0, 25)}...` : data.position}
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
            {data.position.length > 25 ? `${data.position.substring(0, 25)}...` : data.position}
          </Badge>
          <Badge className="bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-md">
            ₹{data.salary.length > 10 ? `${data.salary.substring(0, 10)}...` : data.salary} per annum
          </Badge>
        </div>
      </NavLink>
    </div>
  );
};

export default LatestJobs;
