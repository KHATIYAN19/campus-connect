import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiDollarSign, FiArrowUp, FiArrowDown, FiXCircle, FiBriefcase, FiUser } from 'react-icons/fi'; // Added FiXCircle, FiBriefcase, FiUser
import axios from '../LoginSignUp/axios'; // Ensure path is correct

const PlacementRecord = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState(null);
    const [minSalary, setMinSalary] = useState('');
    const [maxSalary, setMaxSalary] = useState('');
    const [availableYears, setAvailableYears] = useState([]);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [salarySortOrder, setSalarySortOrder] = useState(null); // 'asc' or 'desc'
    const [placementData, setPlacementData] = useState({}); // Changed initial state to object
    const [isLoading, setIsLoading] = useState(true); // Added loading state
    const [error, setError] = useState(null); // Added error state

    // Fetch Data
    useEffect(() => {
        const fetchPlacementRecords = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get("http://localhost:8080/application/placement/records");
                console.log("Fetched placement records:", response.data);
                setPlacementData(response.data || {}); // Ensure it's an object
                setAvailableYears(Object.keys(response.data || {}).sort((a, b) => b - a)); // Sort years numerically descending
            } catch (err) {
                console.error("Error fetching placement records:", err);
                setError("Failed to load placement records.");
                setPlacementData({}); // Reset data on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlacementRecords();
    }, []);

    // --- Formatting & Filtering Logic (mostly unchanged, added sorting stability) ---
    const formatCurrency = (amount) =>
        `₹${amount ? amount.toFixed(2) : '0.00'} LPA`; // Handle potential undefined amount

    const handleSearch = (event) => setSearchTerm(event.target.value);
    const handleYearFilter = (year) => setSelectedYear(year);
    const handleMinSalaryChange = (event) => setMinSalary(event.target.value);
    const handleMaxSalaryChange = (event) => setMaxSalary(event.target.value);
    const toggleFilterVisibility = () => setIsFilterVisible(!isFilterVisible);
    const handleSalarySort = (order) => setSalarySortOrder(order);

    // Compute filtered and sorted data
    const filteredPlacementData = Object.entries(placementData)
        .filter(([year]) => !selectedYear || year === selectedYear)
        .reduce((acc, [year, students]) => {
            if (!Array.isArray(students)) { // Basic data integrity check
                console.warn(`Invalid data structure for year ${year}. Expected array.`);
                return acc;
            }

            const filteredStudents = students.filter(student => {
                // Basic check for student object validity
                if (!student || typeof student !== 'object' || !student.studentName || typeof student.salary !== 'number') {
                    console.warn(`Skipping invalid student record in year ${year}:`, student);
                    return false;
                }

                const searchLower = searchTerm.toLowerCase();
                const nameMatch = student.studentName.toLowerCase().includes(searchLower);
                const companyMatch = (student.companyName?.toLowerCase() || '').includes(searchLower);
                const salaryMatch = student.salary.toString().includes(searchTerm); // Search term might be number

                const salaryFilter =
                    (minSalary === '' || isNaN(parseFloat(minSalary)) || student.salary >= parseFloat(minSalary)) &&
                    (maxSalary === '' || isNaN(parseFloat(maxSalary)) || student.salary <= parseFloat(maxSalary));

                return (nameMatch || companyMatch || salaryMatch) && salaryFilter;
            });

            if (filteredStudents.length > 0) {
                // Apply sorting
                let sortedStudents = [...filteredStudents]; // Create a copy
                if (salarySortOrder) {
                    sortedStudents.sort((a, b) => {
                        const diff = salarySortOrder === 'asc' ? a.salary - b.salary : b.salary - a.salary;
                        // Add secondary sort (e.g., by name) for stability if salaries are equal
                        return diff === 0 ? a.studentName.localeCompare(b.studentName) : diff;
                    });
                }
                 // If no salary sort, could optionally sort by name by default
                 // else { sortedStudents.sort((a, b) => a.studentName.localeCompare(b.studentName)); }

                acc[year] = sortedStudents;
            }
            return acc;
        }, {});

    const hasRecords = Object.keys(filteredPlacementData).length > 0;
    const yearsToDisplay = Object.keys(filteredPlacementData).sort((a, b) => b - a); // Ensure years are sorted

    // --- Component Rendering ---
    return (
        <div className="bg-gray-100 min-h-screen py-10 md:py-16">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                {/* Header Section */}
                <div className="mb-8 md:mb-12 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Placement Records</h1>
                    <p className="text-md text-gray-600">Explore placement details by year, company, and salary.</p>
                </div>

                {/* Controls Section */}
                <div className="mb-6 md:mb-8 flex flex-col md:flex-row items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative group w-full md:flex-grow">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FiSearch className="h-5 w-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by student name, company..."
                            className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* Filter Button */}
                    <button
                        onClick={toggleFilterVisibility}
                        className="w-full md:w-auto flex-shrink-0 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
                    >
                        <FiFilter className="h-5 w-5" />
                        <span>Filter</span>
                    </button>
                </div>

                {/* Filter Box (conditionally rendered with transition) */}
                {isFilterVisible && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200 animate-fade-in-down"> {/* Added animation example */}
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-lg font-semibold text-gray-800">Filter & Sort Options</h3>
                             <button onClick={toggleFilterVisibility} className="text-gray-400 hover:text-gray-600">
                                 <FiXCircle size={20}/>
                             </button>
                        </div>

                        {/* Year Filter */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Year:</label>
                            <div className="flex flex-wrap gap-2">
                                {availableYears.map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => handleYearFilter(year)}
                                        className={`py-1.5 px-4 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 transition ${
                                            selectedYear === year ? 'bg-orange-500 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {year}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handleYearFilter(null)}
                                    className={`py-1.5 px-4 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 transition ${
                                        selectedYear === null ? 'bg-orange-500 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    All Years
                                </button>
                            </div>
                        </div>

                        {/* Salary Filter */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                            <div>
                                <label htmlFor="minSalary" className="block text-sm font-medium text-gray-700 mb-1">Min Salary (LPA)</label>
                                <input
                                    type="number"
                                    id="minSalary"
                                    step="0.1"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                    placeholder="e.g., 5"
                                    value={minSalary}
                                    onChange={handleMinSalaryChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="maxSalary" className="block text-sm font-medium text-gray-700 mb-1">Max Salary (LPA)</label>
                                <input
                                    type="number"
                                    id="maxSalary"
                                    step="0.1"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                    placeholder="e.g., 20"
                                    value={maxSalary}
                                    onChange={handleMaxSalaryChange}
                                />
                            </div>
                        </div>

                        {/* Salary Sorting */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by Salary:</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleSalarySort('asc')}
                                    className={`flex items-center gap-1 py-1.5 px-3 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 transition ${
                                        salarySortOrder === 'asc' ? 'bg-orange-500 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    <FiArrowUp className="h-4 w-4" /> Low to High
                                </button>
                                <button
                                    onClick={() => handleSalarySort('desc')}
                                    className={`flex items-center gap-1 py-1.5 px-3 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 transition ${
                                        salarySortOrder === 'desc' ? 'bg-orange-500 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    <FiArrowDown className="h-4 w-4" /> High to Low
                                </button>
                                <button
                                    onClick={() => handleSalarySort(null)}
                                    className={`py-1.5 px-3 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 transition ${
                                        salarySortOrder === null ? 'bg-orange-500 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    No Sort
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-20 text-gray-500">
                        Loading placement records...
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                     <div className="text-center py-20 text-red-600 bg-red-50 p-6 rounded-lg">
                         <FiXCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                         <p className="text-xl font-semibold mb-2">Error</p>
                         <p>{error}</p>
                     </div>
                 )}

                {/* No Records Found State */}
                {!isLoading && !error && !hasRecords && (
                     <div className="text-center py-20">
                         <FiSearch className="h-16 w-16 mx-auto mb-6 text-gray-400" />
                         <p className="text-xl font-medium text-gray-600 mb-2">No Matching Records Found</p>
                         <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                     </div>
                 )}

                {/* Placement Records Grid */}
                {!isLoading && !error && hasRecords && (
                    yearsToDisplay.map((year) => (
                        <div key={year} className="mb-12">
                            {/* Year Heading */}
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-orange-300 pb-2">
                                {year} Placements
                            </h2>
                            {/* Student Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> {/* Adjusted grid columns */}
                                {filteredPlacementData[year].map((student, index) => (
                                    <div
                                        key={`${year}-${student.studentName}-${index}`} // More robust key
                                        className="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col"
                                    >
                                        <div className="flex-shrink-0 h-48 w-full overflow-hidden">
                                             {/* Improved Image handling */}
                                             <img
                                                 src={student.studentImage || 'https://via.placeholder.com/300x200/cccccc/969696?text=No+Image'} // Placeholder image
                                                 alt={`Photo of ${student.studentName}`}
                                                 className="w-full h-full object-cover object-center" // Ensure image covers area
                                                 onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/300x200/cccccc/969696?text=No+Image'; }} // Fallback on error
                                             />
                                        </div>
                                        <div className="p-5 flex flex-col flex-grow"> {/* Use flex-grow */}
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate" title={student.studentName}>
                                                <FiUser className="inline-block mr-2 mb-1 text-gray-500" />{student.studentName}
                                            </h3>
                                            <p className="text-sm font-medium text-orange-600 mb-3 truncate" title={student.companyName}>
                                                 <FiBriefcase className="inline-block mr-2 mb-1 text-gray-500" />{student.companyName || 'N/A'}
                                             </p>
                                            <div className="mt-auto pt-3"> {/* Push salary to bottom */}
                                                 <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                                     <FiDollarSign className="w-3 h-3" />
                                                     {formatCurrency(student.salary)}
                                                 </span>
                                             </div>
                                        </div>
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

// Add this basic animation to your tailwind.config.js or global CSS if you want the fade-in effect
/*
@keyframes fade-in-down {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-down {
  animation: fade-in-down 0.3s ease-out forwards;
}
*/