import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
// Make sure to install react-icons: npm install react-icons
import { FaSortUp, FaSortDown, FaBookReader, FaFilter } from 'react-icons/fa'; // FaSort is not directly used, FaFilter is the default

const Student = () => {
  // State for storing the list of students
  const [students, setStudents] = useState([]);
  // State for storing the original, unsorted list of students
  const [originalStudents, setOriginalStudents] = useState([]);
  // State to manage loading status
  const [loading, setLoading] = useState(true);
  // State to manage sort configuration { key: 'columnName', direction: 'asc' | 'desc' | null }
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  // State to manage API errors
  const [error, setError] = useState(null);

  // Function to fetch student data from the API
  const fetchStudents = async () => {
    setLoading(true);
    setError(null); // Reset error state on new fetch
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authentication token not found in localStorage.");
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:8080/allstudents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data && res.data.success) {
        // Ensure res.data.data is an array before setting state
        const studentData = Array.isArray(res.data.data) ? res.data.data : [];
        setStudents(studentData);
        setOriginalStudents(studentData);
      } else {
        console.error("Failed to fetch students: API response indicates failure or unexpected structure.", res.data);
        setError(res.data?.message || "Failed to fetch students. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching student data:", err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error data:", err.response.data);
        console.error("Error status:", err.response.status);
        setError(`Error ${err.response.status}: ${err.response.data?.message || 'Could not fetch data from server.'}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("Error request:", err.request);
        setError("No response from server. Please check your network connection and backend server.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", err.message);
        setError(`An unexpected error occurred: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // useEffect hook to fetch students when the component mounts
  useEffect(() => {
    fetchStudents();
  }, []); // Empty dependency array means this runs once on mount

  // useMemo hook to sort students based on sortConfig
  // This recalculates only when students, originalStudents, or sortConfig changes
  const sortedStudents = useMemo(() => {
    if (!sortConfig || sortConfig.direction === null) {
      return [...originalStudents];
    }

    let sortableStudents = [...students];

    sortableStudents.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key && sortConfig.key.includes('.')) {
        const keys = sortConfig.key.split('.');
        aValue = keys.reduce((obj, k) => (obj && obj[k] !== null && obj[k] !== undefined ? obj[k] : ''), a);
        bValue = keys.reduce((obj, k) => (obj && obj[k] !== null && obj[k] !== undefined ? obj[k] : ''), b);
      }
      
      // Convert percentage strings (e.g., "92%") to numbers for correct sorting
      // Also handles CGPA strings like "8.5 CGPA"
      const processScore = (value) => {
        if (typeof value === 'string') {
          const num = parseFloat(value.replace('%', '').replace(/ CGPA/i, ''));
          return isNaN(num) ? value : num; // Return original string if not a number after parsing
        }
        return value;
      };

      if (['profile.tenth', 'profile.tweleth', 'profile.graduationMarks'].includes(sortConfig.key)) {
          aValue = processScore(aValue);
          bValue = processScore(bValue);
      }


      const isANull = aValue === null || aValue === undefined || String(aValue).toUpperCase() === "N/A" || String(aValue).trim() === "";
      const isBNull = bValue === null || bValue === undefined || String(bValue).toUpperCase() === "N/A" || String(bValue).trim() === "";

      if (isANull && isBNull) return 0;
      if (isANull) return 1; 
      if (isBNull) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue);
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue, undefined, {numeric: true, sensitivity: 'base'});
      }
      
      return String(aValue).localeCompare(String(bValue), undefined, {numeric: true, sensitivity: 'base'});
    });

    if (sortConfig.direction === 'desc') {
      sortableStudents.reverse();
    }

    return sortableStudents;
  }, [students, originalStudents, sortConfig]);


  // Function to handle sort requests when a column header is clicked
  const requestSort = (key) => {
    let direction = 'asc'; 
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc'; 
      } else if (sortConfig.direction === 'desc') {
        direction = null; 
        setSortConfig({ key: null, direction: null });
        return;
      }
    }
    setSortConfig({ key, direction });
  };

  // Function to get the appropriate sort icon for a column header
  const getSortIcon = (key) => {
    if (sortConfig.key !== key || sortConfig.direction === null) {
      return <FaFilter className="inline ml-2 text-orange-200 group-hover:text-white transition-colors" />;
    }
    if (sortConfig.direction === 'asc') {
      return <FaSortUp className="inline ml-2 text-white" />;
    }
    return <FaSortDown className="inline ml-2 text-white" />;
  };

  // Configuration for table headers
  const tableHeaders = [
    { key: "image", label: "Image", sortable: false, className: "w-20 text-center" },
    { key: "name", label: "Name", sortable: true, className: "min-w-[150px]" },
    { key: "email", label: "Email", sortable: true, className: "min-w-[200px]" },
    { key: "phone", label: "Phone", sortable: true, className: "min-w-[120px]" },
    { key: "profile.graduationdegree", label: "Degree", sortable: true, className: "min-w-[180px]" },
    { key: "profile.tenth", label: "10th %", sortable: true, className: "text-center min-w-[80px]" },
    { key: "profile.tweleth", label: "12th %", sortable: true, className: "text-center min-w-[80px]" },
    { key: "profile.graduationMarks", label: "B.Tech %/CGPA", sortable: true, className: "text-center min-w-[120px]" },
    { key: "maxoffer", label: "Max Offer (LPA)", sortable: true, className: "text-center min-w-[120px]" },
    { key: "year", label: "Passing Year", sortable: true, className: "text-center min-w-[120px]" },
  ];

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="p-8 text-center text-orange-600 font-semibold text-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          Loading Student Data...
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="p-8 text-center bg-white shadow-xl rounded-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong.</h2>
            <p className="text-gray-700 mb-2">{error}</p>
            <p className="text-gray-500 text-sm mb-6">Please check your connection or try again later. If the issue persists, contact support.</p>
            <button
                onClick={fetchStudents}
                className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
                Try Again
            </button>
        </div>
      </div>
    );
  }


  // Main component render
  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-orange-600 tracking-wide flex items-center justify-center">
          <FaBookReader className="mr-3 text-orange-500" size={40}/> Student Records Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Manage and view student information efficiently.</p>
      </header>

      <div className="overflow-x-auto bg-white shadow-2xl rounded-lg border border-gray-200">
        <table className="min-w-full table-auto">
          <thead className="bg-orange-500 text-white text-xs sm:text-sm uppercase sticky top-0 z-10">
            <tr>
              {tableHeaders.map((header) => (
                <th
                  key={header.key}
                  className={`px-4 py-3 text-left font-semibold group ${header.className || ''} ${header.sortable ? 'cursor-pointer hover:bg-orange-600 transition-colors duration-200' : ''}`}
                  onClick={() => header.sortable && requestSort(header.key)}
                  scope="col"
                >
                  {header.label}
                  {header.sortable && getSortIcon(header.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedStudents.length === 0 && !loading ? (
                <tr>
                    <td colSpan={tableHeaders.length} className="px-5 py-10 text-center text-gray-500 text-lg italic">
                        No student data available at the moment.
                    </td>
                </tr>
            ) : (
              sortedStudents.map((student, index) => (
              <tr 
                key={student._id || index} 
                className="hover:bg-orange-50 transition-colors duration-150 ease-in-out text-sm text-gray-700"
              >
                <td className={`px-4 py-3 whitespace-nowrap ${tableHeaders[0].className}`}>
                  <img
                    src={student.image || `https://placehold.co/60x60/CCCCCC/FFFFFF?text=N/A`} 
                    alt={student.name || 'Student Image'}
                    className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-orange-300 shadow-sm mx-auto"
                    onError={(e) => { 
                      e.target.onerror = null; 
                      e.target.src=`https://placehold.co/60x60/FF0000/FFFFFF?text=Error`; 
                    }}
                  />
                </td>
                <td className={`px-4 py-3 whitespace-nowrap font-medium text-gray-900 ${tableHeaders[1].className}`}>{student.name || <span className="text-gray-400">N/A</span>}</td>
                <td className={`px-4 py-3 whitespace-nowrap ${tableHeaders[2].className}`}>{student.email || <span className="text-gray-400">N/A</span>}</td>
                <td className={`px-4 py-3 whitespace-nowrap ${tableHeaders[3].className}`}>{student.phone || <span className="text-gray-400">N/A</span>}</td>
                <td className={`px-4 py-3 whitespace-nowrap ${tableHeaders[4].className}`}>
                  {student.profile?.graduationdegree || <span className="text-gray-400">N/A</span>}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap ${tableHeaders[5].className}`}>
                  {student.profile?.tenth ?? <span className="text-gray-400">N/A</span>}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap ${tableHeaders[6].className}`}>
                  {student.profile?.tweleth ?? <span className="text-gray-400">N/A</span>}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap ${tableHeaders[7].className}`}>
                  {student.profile?.graduationMarks ?? <span className="text-gray-400">N/A</span>}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap font-semibold text-orange-700 ${tableHeaders[8].className}`}>
                  {(student.maxoffer !== null && student.maxoffer !== undefined) ? student.maxoffer : <span className="text-gray-400">N/A</span>}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap ${tableHeaders[9].className}`}>{student.year || <span className="text-gray-400">N/A</span>}</td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
      { !loading && sortedStudents.length > 0 &&
        <footer className="mt-8 text-center text-sm text-gray-500">
            Displaying <span className="font-semibold text-orange-600">{sortedStudents.length}</span> student record{sortedStudents.length === 1 ? '' : 's'}.
        </footer>
      }
    </div>
  );
};

export default Student;

// To use this component in your App.js or another parent component:
// import Student from './Student'; // Adjust path as needed
// function App() {
//   return (
//     <div className="App">
//       <Student />
//     </div>
//   );
// }
// export default App;

// Ensure you have Tailwind CSS configured in your project.
// If not, you can add the Tailwind CDN for quick testing in your public/index.html:
// <script src="https://cdn.tailwindcss.com"></script>
