import React from "react";
import { useNavigate } from "react-router-dom";
function UserTable({ applies }) {
  const navigate=useNavigate();
  const appliesArray = Array.isArray(applies) ? applies : [];
  const bgColor = appliesArray.length > 0 ? "bg-green-100" : "bg-red-100";
  return (
    <div className={`p-4 md:p-8 ${bgColor} rounded-lg shadow-md`}>
      <div className="overflow-x-auto">
        {appliesArray.length > 0 ? (
          <table className="w-full border-collapse border border-gray-200 text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 border-b border-gray-300">Image</th>
                <th className="p-4 border-b border-gray-300">Name</th>
                <th className="p-4 border-b border-gray-300">Email</th>
                <th className="p-4 border-b border-gray-300">Phone</th>
                <th className="p-4 border-b border-gray-300">Resume</th>
              </tr>
            </thead>
            <tbody >
              {appliesArray.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50" onClick={()=>navigate(`/user/profile/${user._id}`)}>
                  <td className="p-4 border-b border-gray-300">
                    <img
                      src={user.image}
                      alt={`${user.name}'s profile`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </td>
                  <td className="p-4 border-b border-gray-300">{user.name}</td>
                  <td className="p-4 border-b border-gray-300">{user.email}</td>
                  <td className="p-4 border-b border-gray-300">{user.phone}</td>
                  <td className="p-4 border-b border-gray-300">
                    <a
                      href={user.profile.resume}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg font-semibold text-gray-600">
              No applications found.
            </p>
            <p className="text-gray-500">
              Once there are applicants, their details will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserTable;
