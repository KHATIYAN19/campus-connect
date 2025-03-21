import React, { useState } from 'react';
import { FiSearch, FiBriefcase, FiAward, FiTrendingUp, FiDollarSign, FiUser } from 'react-icons/fi';

const PlacementRecord = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const dummyPlacementData = [
    {
      year: 2023,
      totalOffers: 10,
      highestOffer: 1200000,
      averageOffer: 800000,
      selectedStudents: Array.from({ length: 10 }, (_, i) => ({
        _id: `2023-student-${i + 1}`,
        name: `Student ${i + 1} (2023)`,
        email: `student${i + 1}@2023.com`,
        phone: `98765432${i + 1}`,
        role: 'student',
        year: 2023,
        isVerified: true,
        image: `https://i.pravatar.cc/150?img=${i + 1}`,
        profile: { 
          graduationdegree: 'B.Tech', 
          graduationMarks: 75 + i, 
          tenth: 80 + i, 
          tweleth: 85 + i 
        },
        companyName: `Company A ${i % 3 + 1}`,
        salary: 600000 + i * 50000,
        degree: 'B.Tech',
      })),
    },
    {
      year: 2024,
      totalOffers: 10,
      highestOffer: 1500000,
      averageOffer: 950000,
      selectedStudents: Array.from({ length: 10 }, (_, i) => ({
        _id: `2024-student-${i + 1}`,
        name: `Student ${i + 1} (2024)`,
        email: `student${i + 1}@2024.com`,
        phone: `87654321${i + 1}`,
        role: 'student',
        year: 2024,
        isVerified: true,
        image: `https://i.pravatar.cc/150?img=${i + 11}`,
        profile: { 
          graduationdegree: 'MBA', 
          graduationMarks: 80 + i, 
          tenth: 85 + i, 
          tweleth: 90 + i 
        },
        companyName: `Company B ${i % 4 + 1}`,
        salary: 700000 + i * 60000,
        degree: 'MBA',
      })),
    },
    {
      year: 2025,
      totalOffers: 10,
      highestOffer: 1800000,
      averageOffer: 1100000,
      selectedStudents: Array.from({ length: 10 }, (_, i) => ({
        _id: `2025-student-${i + 1}`,
        name: `Student ${i + 1} (2025)`,
        email: `student${i + 1}@2025.com`,
        phone: `76543210${i + 1}`,
        role: 'student',
        year: 2025,
        isVerified: true,
        image: `https://i.pravatar.cc/150?img=${i + 21}`,
        profile: { 
          graduationdegree: 'M.Tech', 
          graduationMarks: 85 + i, 
          tenth: 90 + i, 
          tweleth: 95 + i 
        },
        companyName: `Company C ${i % 5 + 1}`,
        salary: 800000 + i * 70000,
        degree: 'M.Tech',
      })),
    },
    {
      year: 2026,
      totalOffers: 10,
      highestOffer: 2000000,
      averageOffer: 1300000,
      selectedStudents: Array.from({ length: 10 }, (_, i) => ({
        _id: `2026-student-${i + 1}`,
        name: `Student ${i + 1} (2026)`,
        email: `student${i + 1}@2026.com`,
        phone: `65432109${i + 1}`,
        role: 'student',
        year: 2026,
        isVerified: true,
        image: `https://i.pravatar.cc/150?img=${i + 31}`,
        profile: { 
          graduationdegree: 'BCA', 
          graduationMarks: 70 + i, 
          tenth: 75 + i, 
          tweleth: 80 + i 
        },
        companyName: `Company D ${i % 3 + 1}`,
        salary: 550000 + i * 45000,
        degree: 'BCA',
      })),
    },
    {
      year: 2027,
      totalOffers: 10,
      highestOffer: 2200000,
      averageOffer: 1500000,
      selectedStudents: Array.from({ length: 10 }, (_, i) => ({
        _id: `2027-student-${i + 1}`,
        name: `Student ${i + 1} (2027)`,
        email: `student${i + 1}@2027.com`,
        phone: `54321098${i + 1}`,
        role: 'student',
        year: 2027,
        isVerified: true,
        image: `https://i.pravatar.cc/150?img=${i + 41}`,
        profile: { 
          graduationdegree: 'MCA', 
          graduationMarks: 88 + i, 
          tenth: 92 + i, 
          tweleth: 95 + i 
        },
        companyName: `Company E ${i % 4 + 1}`,
        salary: 900000 + i * 80000,
        degree: 'MCA',
      })),
    },
  ];

  const formatCurrency = (amount) => 
    `₹${(amount / 100000).toFixed(2)} LPA`;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredPlacementData = dummyPlacementData
    .map(batch => ({
      ...batch,
      selectedStudents: batch.selectedStudents.filter(student => {
        const searchLower = searchTerm.toLowerCase();
        return (
          student.name.toLowerCase().includes(searchLower) ||
          (student.companyName?.toLowerCase() || '').includes(searchLower) ||
          student.degree.toLowerCase().includes(searchLower) ||
          student.salary.toString().includes(searchLower)
        );
      })
    }))
    .filter(batch => batch.selectedStudents.length > 0);


    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen py-12">
          <div className="mx-auto px-4 lg:px-8 max-w-7xl"> {/* Increased max-width */}
            {/* Wider Search Bar */}
            <div className="mb-12 mx-auto">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                  <FiSearch className="h-6 w-6 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search students by name, company, salary, or degree..."
                  className="w-full px-16 py-4 text-lg rounded-2xl border-0 shadow-xl focus:ring-4 focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
    
            {filteredPlacementData.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-2xl text-gray-500 mb-4">No matching records found</div>
                <div className="text-gray-400">Try searching with different keywords</div>
              </div>
            ) : (
              filteredPlacementData.map((batch) => (
                <div key={batch.year} className="mb-12">
                  {/* Wider Batch Header */}
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-2xl p-8 mb-8 mx-2">
                    <h2 className="text-3xl font-bold text-white mb-6">Batch of {batch.year}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> {/* Adjusted grid */}
                      {/* ... [Keep batch stats cards same] ... */}
                    </div>
                  </div>
    
                  {/* Wider Student Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"> {/* Reduced columns */}
                    {batch.selectedStudents.map((student) => (
                      <div 
                        key={student._id} 
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden min-w-[320px]" // Added min-width
                      >
                        <div className="p-8"> {/* Increased padding */}
                          <div className="flex flex-col items-center">
                            <div className="relative mb-6"> {/* Increased margin */}
                              <img
                                src={student.image}
                                alt={student.name}
                                className="w-40 h-40 rounded-full object-cover border-4 border-indigo-50 shadow-lg group-hover:border-indigo-100 transition-colors" // Larger image
                              />
                              <div className="absolute bottom-0 right-0 bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium"> {/* Larger badge */}
                                {student.degree}
                              </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{student.name}</h3> {/* Larger text */}
                            <p className="text-indigo-600 font-semibold mb-3 text-lg">{student.companyName}</p> {/* Larger text */}
                            <div className="flex items-center space-x-3 bg-green-100 px-4 py-2 rounded-full"> {/* Larger badge */}
                              <FiDollarSign className="text-green-600 text-lg" />
                              <span className="text-green-700 font-medium text-lg">
                                {formatCurrency(student.salary)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-8 py-6 border-t border-gray-100"> {/* Increased padding */}
                          <div className="grid grid-cols-3 gap-5 text-center text-base"> {/* Larger text */}
                            <div>
                              <div className="text-gray-500">10th</div>
                              <div className="font-medium">{student.profile.tenth}%</div>
                            </div>
                            <div>
                              <div className="text-gray-500">12th</div>
                              <div className="font-medium">{student.profile.tweleth}%</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Grad</div>
                              <div className="font-medium">{student.profile.graduationMarks}%</div>
                            </div>
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
    