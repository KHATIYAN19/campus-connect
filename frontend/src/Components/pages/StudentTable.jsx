import { useState } from 'react';
const StudentTable = ({users}) => {
  const [students, setStudents] = useState(users);

  const handleStatusChange = (id, newStatus) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, status: newStatus } : student
    ));
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'selected':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600">
              <tr>
                {['Image', 'Name', 'Email', 'Phone', 'Degree', '10th %', '12th %', 'Graduation', 'Status'].map((header) => (
                  <th 
                    key={header}
                    className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student,idx) => (
                <tr 
                  key={student._id} 
                  className="hover:bg-blue-50 transition-colors duration-200 ease-in-out"
                >
                  <td className="px-6 py-4">
                    <img 
                      src={student?.student?.image} 
                      alt={student.name}
                      className="h-12 w-12 rounded-full object-cover shadow-md border-2 border-white"
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{student?.student?.name}</td>
                  <td className="px-6 py-4 text-gray-600">{student?.student?.email}</td>
                  <td className="px-6 py-4 text-gray-600">{student?.student?.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{student?.student?.profile?.graduationdegree}</td>
                  <td className="px-6 py-4 text-gray-800 font-semibold text-right">{student?.student?.profile?.tenth}</td>
                  <td className="px-6 py-4 text-gray-800 font-semibold text-right">{student?.student?.profile?.tweleth}</td>
                  <td className="px-6 py-4 text-gray-800 font-semibold text-right">{student?.student?.profile?.graduationMarks}%</td>
                  <td className="px-6 py-4">
                    {student.status === 'pending' ? (
                      <div className="relative">
                        <select
                          value={student.status}
                          onChange={(e) => handleStatusChange(student.id, e.target.value)}
                          className={`w-36 px-4 py-2 pr-8 rounded-xl font-medium transition-all duration-200 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                            border ${getStatusStyle(student.status)}
                            hover:shadow-md cursor-pointer appearance-none`}
                        >
                          <option value="pending">Pending</option>
                          <option value="selected">Selected</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getStatusStyle(student.status)}`}>
                        <span className="text-sm font-semibold capitalize">
                          {student.status}
                          {student.status === 'selected' && ' ✓'}
                          {student.status === 'rejected' && ' ✗'}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentTable;