import React from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Calendar, Building, DollarSign } from 'lucide-react';
import { FaRupeeSign } from "react-icons/fa";

const JobTable = ({ jobData, admin }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-3xl shadow-xl">
      <div className="rounded-2xl overflow-hidden bg-white shadow-md">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 text-center">
          <h2 className="text-xl font-semibold">{admin ? 'Your Posted Job Listings' : 'Your Job Applications'}</h2>
          <p className="text-sm mt-1">{admin ? 'Manage and view your posted opportunities' : 'Track the status of your applications'}</p>
        </div>
        <div className="overflow-x-auto">
          {jobData && jobData.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Logo
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobData.map((application) => (
                  <tr
                    key={application._id}
                    className="hover:bg-indigo-50 cursor-pointer transition duration-150"
                    onClick={() => navigate(`/description/${application.company._id}`)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                          <img className="h-full w-full object-contain" src={application.company.logo} alt={`${application.company.company} logo`} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {application.company.company}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center">
                        <Building className="h-4 w-4 mr-2 text-indigo-400" />
                        {application.company.location}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-700 font-semibold flex items-center">
                        <FaRupeeSign className="h-4 w-4 mr-2 text-green-500" />
                        {application.company.salary} LPA
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {formatDate(application.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        application.status === 'selected' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {application.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 px-6 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-lg font-semibold text-gray-700">
                {admin ? 'No Jobs Posted Yet' : 'You haven\'t applied to any jobs yet'}
              </h2>
              <p className="mt-2 text-gray-500">
                {admin ? 'Start posting job opportunities to connect with potential candidates.' : 'Explore available job listings and start applying to your dream roles.'}
              </p>
              {!admin && (
                <button
                  onClick={() => navigate('/jobs')}
                  className="mt-4 bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
                >
                  Browse Jobs
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobTable;