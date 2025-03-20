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
      setError('Failed to fetch student data. Please try again.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Search Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Student Placement Tracker
          </h1>
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setTouched(true);
                }}
                placeholder="Enter student email..."
                className="w-full pl-12 pr-24 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-1 top-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center"
              >
                <FiSearch className="mr-2" />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            {touched && error && (
              <p className="text-red-500 mt-2 text-sm">{error}</p>
            )}
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Fetching student details...</p>
          </div>
        )}

        {/* Student Details */}
        {studentData && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Student Profile Section */}
            <div className="flex flex-col md:flex-row items-start mb-8 gap-6">
              <img
                src={studentData.student?.image || '/placeholder-user.jpg'}
                alt={studentData.student?.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {studentData.student?.name}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiMail className="flex-shrink-0" />
                    <span>{studentData.student?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiPhone className="flex-shrink-0" />
                    <span>{studentData.student?.phone || 'N/A'}</span>
                  </div>
                </div>

                {/* Academic Marks */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">10th Marks</p>
                    <p className="font-semibold text-blue-700">
                      {studentData.student?.profile?.tenth || 'N/A'}%
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">12th Marks</p>
                    <p className="font-semibold text-green-700">
                      {studentData.student?.profile?.tweleth || 'N/A'}%
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Graduation</p>
                    <p className="font-semibold text-purple-700">
                      {studentData.student?.profile?.graduationMarks || 'N/A'}%
                    </p>
                  </div>
                </div>

                {/* Degree Information */}
                <div className="mt-4 flex items-center gap-2 text-gray-600">
                  <HiAcademicCap className="flex-shrink-0" />
                  <span className="font-medium">
                    {studentData.student?.profile?.graduationdegree || 'Degree information not available'}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    Batch: {studentData.student?.year}
                  </span>
                </div>
              </div>
            </div>

            {/* Company Applications */}
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Placement Applications ({studentData.companies?.length || 0})
            </h3>
            <div className="grid gap-6">
              {studentData.companies?.map((application) => (
                <div
                  key={application.company.jobid}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all border-l-4 border-blue-500"
                >
                  <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="flex items-start flex-1">
                      <img
                        src={application.company.logo || '/placeholder-company.png'}
                        alt={application.company.company}
                        className="w-16 h-16 object-contain mr-4 bg-white p-2 rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {application.company.company}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">{application.company.position}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            application.status.toLowerCase() === 'selected' 
                              ? 'bg-green-100 text-green-800'
                              : application.status.toLowerCase() === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {application.status}
                          </span>
                          {application.company.createdAt && (
                            <span className="text-sm text-gray-500">
                              <HiCalendar className="inline mr-1" />
                              {formatDateTime(application.createdAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">
                        <HiCash className="inline mr-1 text-green-600" />
                        ₹{application.company.salary?.toLocaleString() || 'N/A'} LPA
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
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
              <div className="text-center py-8 text-gray-500">
                No placement applications found for this student
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSearch;