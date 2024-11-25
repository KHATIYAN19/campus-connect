import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const JobApplicantsTable = ({ fetchData }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const data = await fetchData();
        setApplicants(data);
      } catch (error) {
        console.error('Error fetching applicants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-purple-300 p-6">
      <Card className="max-w-5xl mx-auto shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Job Applicants
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-700">Loading applicants...</p>
          ) : applicants.length === 0 ? (
            <p className="text-center text-gray-500">No applicants available.</p>
          ) : (
            <table className="w-full border-collapse bg-white rounded-lg shadow-md overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-700 font-semibold">Image</th>
                  <th className="text-left px-4 py-3 text-gray-700 font-semibold">Name</th>
                  <th className="text-left px-4 py-3 text-gray-700 font-semibold">Email</th>
                  <th className="text-left px-4 py-3 text-gray-700 font-semibold">Phone</th>
                  <th className="text-left px-4 py-3 text-gray-700 font-semibold">Resume</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-gray-100 transition duration-200">
                    <td className="px-4 py-3">
                      <img
                        src={applicant.image}
                        alt={applicant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-800">{applicant.name}</td>
                    <td className="px-4 py-3 text-gray-600">{applicant.email}</td>
                    <td className="px-4 py-3 text-gray-600">{applicant.phone}</td>
                    <td className="px-4 py-3">
                      <a
                        href={applicant.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Resume
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobApplicantsTable;
