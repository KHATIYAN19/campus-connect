import React, { useState, useEffect } from 'react';
import { FiSearch, FiBriefcase, FiAward, FiTrendingUp, FiDollarSign, FiUser, FiFilter, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import axios from '../LoginSignUp/axios'

const PlacementRecord = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState(null);
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [salarySortOrder, setSalarySortOrder] = useState(null); // 'asc' or 'desc'

  const [dummyPlacementData,setDummyPlacementData]= useState([]);



  useEffect(() => {
    const fetchPlacementRecords = async () => {
      try {
        const response = await axios.get("http://localhost:8080/application/placement/records");
        console.log("Fetched placement records:", response.data);
        setDummyPlacementData(response.data)
      } catch (error) {
        console.error("Error fetching placement records:", error);
      }
    };

    fetchPlacementRecords();
  }, []);
  useEffect(() => {
    setAvailableYears(Object.keys(dummyPlacementData).sort().reverse());
  }, [dummyPlacementData]);

  const formatCurrency = (amount) =>
    `₹${(amount).toFixed(2)} LPA`;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleYearFilter = (year) => {
    setSelectedYear(year);
  };

  const handleMinSalaryChange = (event) => {
    setMinSalary(event.target.value);
  };

  const handleMaxSalaryChange = (event) => {
    setMaxSalary(event.target.value);
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const sortStudents = (students) => {
    if (salarySortOrder === 'asc') {
      return [...students].sort((a, b) => a.salary - b.salary);
    } else if (salarySortOrder === 'desc') {
      return [...students].sort((a, b) => b.salary - a.salary);
    }
    return students;
  };

  const handleSalarySort = (order) => {
    setSalarySortOrder(order);
  };

  const filteredPlacementData = Object.entries(dummyPlacementData)
    .filter(([year]) => !selectedYear || year === selectedYear)
    .reduce((acc, [year, students]) => {
      const filteredStudents = students.filter(student => {
        const searchLower = searchTerm.toLowerCase();
        const salaryFilter =
          (minSalary === '' || student.salary >= parseFloat(minSalary)) &&
          (maxSalary === '' || student.salary <= parseFloat(maxSalary));

        return (
          student.studentName.toLowerCase().includes(searchLower) ||
          (student.companyName?.toLowerCase() || '').includes(searchLower) ||
          student.salary.toString().includes(searchLower)
        ) && salaryFilter;
      });

      if (filteredStudents.length > 0) {
        acc[year] = sortStudents(filteredStudents); // Apply sorting here
      }
      return acc;
    }, {});

  const hasRecords = Object.keys(filteredPlacementData).length > 0;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen py-12">
      <div className="mx-auto px-4 lg:px-8 max-w-7xl"> {/* Increased max-width */}
        {/* Wider Search Bar and Filter Button */}
        <div className="mb-8 mx-auto flex items-center justify-between">
          <div className="relative group w-full md:w-1/2 lg:w-2/3 mr-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
              <FiSearch className="h-6 w-6 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search students by name, company, or salary..."
              className="w-full px-16 py-4 text-lg rounded-2xl border-0 shadow-xl focus:ring-4 focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={toggleFilterVisibility}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
          >
            <FiFilter className="h-5 w-5 inline-block mr-2" /> Filter
          </button>
        </div>

        {/* Filter Box (conditionally rendered) */}
        {isFilterVisible && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Filter Options</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <span className="text-gray-600 font-medium">Filter by Year:</span>
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearFilter(year)}
                  className={`py-2 px-4 rounded-full text-sm font-semibold ${
                    selectedYear === year ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors`}
                >
                  {year}
                </button>
              ))}
              <button
                onClick={() => handleYearFilter(null)}
                className={`py-2 px-4 rounded-full text-sm font-semibold ${
                  selectedYear === null ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors`}
              >
                All Years
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="minSalary" className="block text-gray-700 text-sm font-bold mb-2">
                  Min Salary (LPA):
                </label>
                <input
                  type="number"
                  id="minSalary"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="e.g., 7"
                  value={minSalary}
                  onChange={handleMinSalaryChange}
                />
              </div>
              <div>
                <label htmlFor="maxSalary" className="block text-gray-700 text-sm font-bold mb-2">
                  Max Salary (LPA):
                </label>
                <input
                  type="number"
                  id="maxSalary"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="e.g., 9"
                  value={maxSalary}
                  onChange={handleMaxSalaryChange}
                />
              </div>
            </div>

            {/* Salary Sorting Options */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">Sort by Salary:</span>
              <button
                onClick={() => handleSalarySort('asc')}
                className={`py-2 px-3 rounded-md text-sm font-semibold ${
                  salarySortOrder === 'asc' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors`}
              >
                <FiArrowUp className="h-4 w-4 inline-block mr-1" /> Low to High
              </button>
              <button
                onClick={() => handleSalarySort('desc')}
                className={`py-2 px-3 rounded-md text-sm font-semibold ${
                  salarySortOrder === 'desc' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors`}
              >
                <FiArrowDown className="h-4 w-4 inline-block mr-1" /> High to Low
              </button>
              <button
                onClick={() => handleSalarySort(null)}
                className={`py-2 px-3 rounded-md text-sm font-semibold ${
                  salarySortOrder === null ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors`}
              >
                No Sort
              </button>
            </div>
          </div>
        )}

        {!hasRecords ? (
          <div className="text-center py-20">
            <div className="text-2xl text-gray-500 mb-4">No matching records found</div>
            <div className="text-gray-400">Try adjusting the filters or search keywords</div>
          </div>
        ) : (
          Object.entries(filteredPlacementData).map(([year, students]) => (
            <div key={year} className="mb-12">
              {/* Wider Student Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"> {/* Reduced columns */}
                {students.map((student, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden relative" // Added relative for absolute positioning
                    style={{ borderTop: `6px solid #6366f1` }} // Added top border for visual separation
                  >
                    <div className="absolute top-4 left-4 bg-indigo-100 text-indigo-700 py-1 px-2 rounded-md text-sm font-semibold">
                      Batch of {year}
                    </div>
                    <div className="p-8"> {/* Increased padding */}
                      <div className="flex flex-col items-center">
                        <div className="relative mb-6"> {/* Increased margin */}
                          <img
                            src={student.studentImage}
                            alt={student.studentName}
                            className="w-40 h-40 rounded-full object-cover border-4 border-indigo-50 shadow-lg group-hover:border-indigo-100 transition-colors" // Larger image
                          />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{student.studentName}</h3> {/* Slightly smaller text */}
                        <p className="text-indigo-600 font-semibold mb-2 text-lg">{student.companyName}</p> {/* Slightly smaller margin */}
                        <div className="flex items-center space-x-2 bg-green-100 px-3 py-1.5 rounded-full"> {/* Smaller badge */}
                          <FiDollarSign className="text-green-600 text-md" />
                          <span className="text-green-700 font-medium text-md">
                            {formatCurrency(student.salary)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* The provided data does not have profile information */}
                    {/* You can add more details or styling here to make the card more attractive */}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlacementRecord;