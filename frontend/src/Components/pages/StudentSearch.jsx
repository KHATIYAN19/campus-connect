import { useState } from 'react';
import { FiSearch, FiMail, FiPhone } from 'react-icons/fi';
import { HiOfficeBuilding, HiCalendar, HiCash, HiAcademicCap } from 'react-icons/hi';
import axios from '../LoginSignUp/axios';

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  return date.toLocaleDateString('en-US', options).replace(',', '');
};

const StudentSearch = () => {
  const [email, setEmail] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setTouched(true);

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setStudentData(null);

    try {
      const response = await axios.get(`/application/find/comapny/${email}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data.success) {
        setStudentData(response.data);
      } else {
        setError('Student not found');
      }
    } catch (err) {
      setError('No user found');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white py-6 px-8">
          <h1 className="text-3xl font-bold text-center">
            Student Placement Tracker
          </h1>
          <p className="text-center mt-1 text-gray-200">Find student placement details easily.</p>
        </div>

        <div className="p-8">
          {/* Search Section */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <FiMail className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setTouched(true);
                  }}
                  placeholder="Enter student email..."
                  className="w-full pl-10 pr-14 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent text-gray-700"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1 top-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50 transition-colors flex items-center shadow-md"
                  style={{ marginRight: '4px' }} // Added margin
                >
                  <FiSearch className="h-5 w-5" />
                </button>
              </div>
              {touched && error && (
                <p className="text-red-500 mt-2 text-sm">{error}</p>
              )}
            </form>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-600">Fetching student details...</p>
            </div>
          )}

          {/* Student Details */}
          {studentData && !loading && (
            <div className="bg-gray-50 rounded-md shadow-sm p-6">
              {/* Student Profile Section */}
              <div className="flex flex-col md:flex-row items-start mb-6 gap-6">
                <img
                  src={studentData.student?.image || '/placeholder-user.jpg'}
                  alt={studentData.student?.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-orange-200 shadow-md"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    {studentData.student?.name}
                  </h2>
                  <p className="text-gray-600 mb-2">{studentData.student?.email || 'N/A'}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center gap-1 text-gray-500">
                      <FiMail className="flex-shrink-0 h-4 w-4" />
                      <span>{studentData.student?.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <FiPhone className="flex-shrink-0 h-4 w-4" />
                      <span>{studentData.student?.phone || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Academic Marks */}
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div className="bg-white p-2 rounded-md shadow-sm border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">10th Marks</p>
                      <p className="font-semibold text-orange-500">
                        {studentData.student?.profile?.tenth || 'N/A'}%
                      </p>
                    </div>
                    <div className="bg-white p-2 rounded-md shadow-sm border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">12th Marks</p>
                      <p className="font-semibold text-orange-500">
                        {studentData.student?.profile?.tweleth || 'N/A'}%
                      </p>
                    </div>
                    <div className="bg-white p-2 rounded-md shadow-sm border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Graduation</p>
                      <p className="font-semibold text-orange-500">
                        {studentData.student?.profile?.graduationMarks || 'N/A'}%
                      </p>
                    </div>
                  </div>

                  {/* Degree Information */}
                  <div className="mt-3 flex items-center gap-2 text-gray-500">
                    <HiAcademicCap className="flex-shrink-0 h-4 w-4" />
                    <span className="font-medium">
                      {studentData.student?.profile?.graduationdegree || 'Degree information not available'}
                    </span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                      Batch: {studentData.student?.year}
                    </span>
                  </div>
                </div>
              </div>

              {/* Company Applications */}
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Placement Applications ({studentData.companies?.length || 0})
              </h3>
              <div className="grid gap-4">
                {studentData.companies?.map((application) => (
                  <div
                    key={application.company.jobid}
                    className="bg-white rounded-md p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col md:flex-row items-start justify-between gap-3">
                      <div className="flex items-start flex-1">
                        <img
                          src={application.company.logo || '/placeholder-company.png'}
                          alt={application.company.company}
                          className="w-12 h-12 object-contain mr-3 bg-gray-100 p-1 rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="text-md font-semibold text-gray-800">
                            {application.company.company}
                          </h4>
                          <p className="text-sm text-gray-600 mb-1">{application.company.position}</p>
                          <div className="flex flex-wrap items-center gap-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              application.status.toLowerCase() === 'selected'
                                ? 'bg-green-100 text-green-800'
                                : application.status.toLowerCase() === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {application.status}
                            </span>
                            {application.company.createdAt && (
                              <span className="text-xs text-gray-500">
                                <HiCalendar className="inline mr-1" />
                                {formatDateTime(application.createdAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-md font-bold text-gray-800">
                          <HiCash className="inline mr-1 text-green-600" />
                          ₹{application.company.salary?.toLocaleString() || 'N/A'} LPA
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <HiOfficeBuilding className="inline mr-1" />
                          {application.company.location || 'Location not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* No Applications State */}
              {studentData.companies?.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No placement applications found for this student
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentSearch;