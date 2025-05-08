import React, { useState } from 'react';
 import axios from '../LoginSignUp/axios';
 import { FiSearch, FiMail, FiPhone } from 'react-icons/fi';
 import { HiAcademicCap, HiCalendar, HiCash } from 'react-icons/hi';

 const CompanySearch = () => {
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const handleSearch = async (e) => {
  e.preventDefault();
  setTouched(true);
  if (!searchInput.trim()) {
  setError('Please enter a Company ID or Name');
  return;
  }

  setLoading(true);
  setError('');
  setCompanyData(null);
  setAllStudents([]);
  try {
  const response = await axios.get(`/application/find/student/${searchInput}`, {
  headers: { 'Content-Type': 'application/json' },
  });
  console.log(response.data);
  if (response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
  // Assuming all entries in 'data' relate to the same company for a single search
  setCompanyData({
  companyName: response.data.data[0].companyName,
  companyImage: response.data.data[0].companyImage,
  });
  // Flatten the userSelected arrays from all company entries
  const allSelectedStudents = response.data.data.reduce((acc, curr) => {
  return acc.concat(curr.userSelected);
  }, []);
  setAllStudents(allSelectedStudents);
  if (allSelectedStudents.length === 0) {
  setError(`No students selected in ${searchInput}`); // Use searchInput for company name
  }
  } else if (response.data.success && (!response.data.data || response.data.data.length === 0)) {
  setError('No company found with this ID or Name.');
  } else {
  setError('No results found');
  }
  } catch (error) {
  console.error('Error fetching data:', error);
  setError('Failed to fetch data.');
  }
  setLoading(false);
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-orange-100 to-gray-100 py-10">
  <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
  {/* Header Section */}
  <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white py-6 px-8">
  <h1 className="text-3xl font-bold text-center">
  Find Placed Alumni & Students
  </h1>
  <p className="text-center mt-1 text-gray-200">Search for students placed in companies.</p>
  </div>

  <div className="p-8">
  {/* Search Section */}
  <div className="mb-8">
  <form onSubmit={handleSearch} className="max-w-md mx-auto">
  <div className="relative">
  <input
  type="text"
  value={searchInput}
  onChange={(e) => {
  setSearchInput(e.target.value);
  setTouched(true);
  }}
  placeholder="Enter Company ID or Name..."
  className="w-full pl-4 pr-14 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent text-gray-700"
  />
  <button
  type="submit"
  disabled={loading}
  className="absolute right-1 top-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50 transition-colors flex items-center shadow-md"
  style={{ marginRight: '4px' }}
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
  <p className="mt-4 text-gray-600">Searching for placements...</p>
  </div>
  )}

  {/* Company Details (Shown Once) */}
  {companyData && !loading && allStudents.length > 0 && (
  <div className="bg-gray-50 rounded-md shadow-sm p-6 mb-6">
  <div className="flex items-start gap-6">
  <img
  src={companyData.companyImage || '/placeholder-company.png'}
  alt={companyData.companyName}
  className="w-20 h-20 object-contain rounded-md border border-gray-200 bg-white p-1"
  />
  <div>
  <h2 className="text-xl font-semibold text-gray-800 mb-1">
  {companyData.companyName}
  </h2>
  </div>
  </div>
  </div>
  )}

  {/* Students Grid */}
  {!loading && companyData && allStudents.length > 0 && (
  <div>
  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
  Placed Students ({allStudents.length})
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {allStudents.map((student) => (
  <div
  key={student.useremail} // Using email as a more unique key
  className="bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all flex flex-col items-center p-6"
  >
  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-orange-200 mb-3">
  <img
  src={student.userimage || '/placeholder-user.jpg'}
  alt={student.username}
  className="object-cover w-full h-full"
  />
  </div>
  <h4 className="text-md font-semibold text-gray-800 mb-1">
  {student.username}
  </h4>
  <p className="text-sm text-gray-500 flex items-center gap-1 mb-1">
  <HiAcademicCap className="h-4 w-4 text-orange-400" />
  {student.userdegree || 'N/A'}
  </p>
  <p className="text-sm font-semibold text-orange-600 flex items-center gap-1 mb-2">
  <HiCash className="h-4 w-4 text-orange-600" />
  ₹{student.salary || 'N/A'} LPA
  </p>
  <div className="w-full border-t border-gray-200 pt-3 text-sm text-gray-600">
  {student.useremail && (
  <p className="flex items-center gap-1 justify-center mb-1">
  <FiMail className="h-4 w-4 text-gray-400" />
  {student.useremail}
  </p>
  )}
  {student.userphonenumber && (
  <p className="flex items-center gap-1 justify-center">
  <FiPhone className="h-4 w-4 text-gray-400" />
  {student.userphonenumber}
  </p>
  )}
  </div>
  </div>
  ))}
  </div>
  </div>
  )}

  {/* Error Messages */}
  {!loading && error === 'Failed to fetch data.' && (
  <div className="text-center py-8 text-red-500">
  No company found.
  </div>
  )}

  {!loading && error !== 'Failed to fetch data.' && error.startsWith('No students selected in') && (
  <div className="text-center py-8 text-gray-500">
  {error}
  </div>
  )}

  {!loading && error && !error.startsWith('No students selected in') && error !== 'Failed to fetch data.' && (
  <div className="text-center py-8 text-red-500">
  {error}
  </div>
  )}

  {!loading && !companyData && touched && allStudents.length === 0 && !error && (
  <div className="text-center py-8 text-gray-500">
  No company found with the provided ID or Name.
  </div>
  )}
  </div>
  </div>
  </div>
  );
 };

 export default CompanySearch;