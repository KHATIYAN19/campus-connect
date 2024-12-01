import React from "react";
import { useNavigate } from "react-router-dom";
const JobTable = ({jobData,admin}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const navigate=useNavigate();
  return (
    
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-blue-600 text-white text-center">
          <h1 className="text-2xl font-bold">Job Listings</h1>
          <p className="text-sm mt-1">{admin?(`Your Posted Jobs`):(`Your Applied Jobs`)}</p>
        </div>
        <div className="overflow-x-auto">
          {jobData && jobData.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-gray-700 font-medium">Logo</th>
                  <th className="p-4 text-gray-700 font-medium">Company Name</th>
                  <th className="p-4 text-gray-700 font-medium">Location</th>
                  <th className="p-4 text-gray-700 font-medium">Salary</th>
                  <th className="p-4 text-gray-700 font-medium">Date Posted</th>
                </tr>
              </thead>
              <tbody>
                {jobData.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-blue-50 cursor-pointer transition duration-200"
                    onClick={() => navigate(`/description/${job._id}`)}
                  >
                    <td className="p-4 border-b border-gray-200">
                      <img
                        src={job.logo}
                        alt={`${job.company} logo`}
                        className="w-12 h-12 object-contain rounded-full"
                      />
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <span className="font-semibold">{job.company}</span>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      {job.location}
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <span className="text-green-600 font-semibold">
                        {job.salary+" LPA"}
                      </span>
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      <span className="text-gray-500">{formatDate(job.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-10 text-center">
              <h2 className="text-xl font-bold text-gray-700">
                {admin?(`No Jobs Posted`):(`Never applied in Jobs`)}
              </h2>
              <p className="text-gray-500 mt-2">
                {admin?(`Post new Jobs`):(`Apply in new Jobs`)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobTable;
