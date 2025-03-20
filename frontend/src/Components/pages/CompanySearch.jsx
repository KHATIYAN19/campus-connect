import { useState } from 'react';
import axios from '../LoginSignUp/axios';
import { FiSearch } from 'react-icons/fi';

const CompanySearch = () => {
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      setError('Please enter a Company ID or Name');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/application/find/student/${searchInput}`, {
        headers: { 'Content-Type': 'application/json' },
      });
       console.log(response.data)
      if (response.data.success) {
        setCompanyData(response.data.job);
        setStudents(response.data.data || []);
      } else {
        setError('No results found');
        setCompanyData(null);
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('No Company found ');
      setStudents([]);
      setCompanyData(null);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Search Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Find Placed Alumni & Students
          </h1>
          <p className="text-gray-600 mb-8">
            Search for students and alumni placed in companies using Company ID or Name
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 bg-white rounded-full shadow-lg px-6 py-3 hover:shadow-xl transition-shadow">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Company ID or Name..."
                className="flex-1 p-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:opacity-90 disabled:opacity-50 transition-all"
              >
                <FiSearch className="w-6 h-6" />
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching for placements...</p>
          </div>
        )}

        {/* Company Details */}
        {companyData && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 transition-all hover:shadow-2xl">
            <div className="flex items-center gap-6">
              <img 
                src={companyData.logo || '/placeholder-company.png'} 
                alt="Company Logo" 
                className="w-24 h-24 object-contain rounded-xl border-2 border-gray-100"
              />
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {companyData.company}
                </h2>
                <p className="text-gray-600">{companyData.location}</p>
              </div>
            </div>
          </div>
        )}

        {/* Students Grid */}
        {!loading && students.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Placed Students ({students.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student,idx) => (
                <div 
                  key={student._id} 
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={student.image || '/placeholder-user.jpg'}
                      alt={student.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-50 mb-4"
                    />
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {student.name}
                    </h3>
                    <p className="text-blue-600 font-medium mb-2">{student.degree}</p>
                    
                    <div className="w-full space-y-2 mt-4">
                      <div className="flex justify-between items-center text-sm px-4">
                        <span className="text-gray-500">Batch Year</span>
                        <span className="text-gray-700 font-medium">{student.year}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm px-4">
                        <span className="text-gray-500">Email</span>
                        <span className="text-gray-700 font-medium">{student.email}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm px-4">
                        <span className="text-gray-500">Contact</span>
                        <span className="text-gray-700 font-medium">{student.phone}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm px-4">
                        <span className="text-gray-500">Package</span>
                        <span className="text-green-600 font-semibold">
                          ₹{student.salary?.toLocaleString()} LPA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && companyData && students.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
            <p className="text-2xl text-gray-500">
              🎓 No students placed in this company yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySearch;