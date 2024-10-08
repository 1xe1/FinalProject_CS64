import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:3000/api/students").then((response) =>
        response.json()
      ),
      fetch("http://localhost:3000/api/faculties").then((response) =>
        response.json()
      ),
      fetch("http://localhost:3000/api/departments").then((response) =>
        response.json()
      ),
    ])
      .then(([studentsData, facultiesData, departmentsData]) => {
        setStudents(studentsData);
        setFaculties(facultiesData);
        setDepartments(departmentsData);
        setLoading(false);
      })
      .catch(() => setLoading(false)); // Handle any errors in fetching data
  }, []);

  const filterDepartmentsByFaculty = (facultyID) => {
    if (facultyID) {
      const filtered = departments.filter(
        (department) => department.FacultyID === parseInt(facultyID)
      );
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments(departments);
    }
  };

  const handleFacultyChange = (e) => {
    const facultyID = e.target.value;
    setSelectedFaculty(facultyID);
    filterDepartmentsByFaculty(facultyID);
    setSelectedDepartment(""); // Reset department selection on faculty change
  };

  const filteredStudents = useMemo(() => {
    return students
      .filter(
        (student) =>
          (selectedFaculty
            ? student.FacultyID === parseInt(selectedFaculty)
            : true) &&
          (selectedDepartment
            ? student.DepartmentID === parseInt(selectedDepartment)
            : true) &&
          (searchQuery
            ? student.FirstName.toLowerCase().includes(
                searchQuery.toLowerCase()
              ) ||
              student.LastName.toLowerCase().includes(
                searchQuery.toLowerCase()
              ) ||
              student.StudentStatus.toLowerCase().includes(
                searchQuery.toLowerCase()
              ) ||
              student.StudentID.toString().includes(searchQuery)
            : true)
      )
      .map((student) => ({
        ...student,
        facultyName:
          faculties.find((faculty) => faculty.FacultyID === student.FacultyID)
            ?.FacultyName || "ไม่ระบุ",
        departmentName:
          departments.find(
            (department) => department.DepartmentID === student.DepartmentID
          )?.DepartmentName || "ไม่ระบุ",
      }));
  }, [
    students,
    selectedFaculty,
    selectedDepartment,
    searchQuery,
    faculties,
    departments,
  ]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          ข้อมูลนักศึกษา
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              ค้นหา:
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="ค้นหา"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              คณะ:
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedFaculty}
              onChange={handleFacultyChange}
            >
              <option value="">ทั้งหมด</option>
              {faculties.map((faculty) => (
                <option key={faculty.FacultyID} value={faculty.FacultyID}>
                  {faculty.FacultyName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              สาขาวิชา:
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">ทั้งหมด</option>
              {filteredDepartments.map((department) => (
                <option
                  key={department.DepartmentID}
                  value={department.DepartmentID}
                >
                  {department.DepartmentName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead className="bg-[#111926] text-white">
            <tr>
              <th className="w-1/4 py-3 px-4 text-left">รหัสนักศึกษา</th>
              <th className="w-1/4 py-3 px-4 text-left">ชื่อ</th>
              <th className="w-1/4 py-3 px-4 text-left">นามสกุล</th>
              <th className="w-1/4 py-3 px-4 text-left">สถานะ</th>
              <th className="py-3 px-4 text-left">* </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {paginatedStudents.map((student, index) => (
              <tr
                key={student.StudentID}
                className={`hover:bg-gray-100 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-3 px-4">{student.StudentID}</td>
                <td className="py-3 px-4">{student.FirstName}</td>
                <td className="py-3 px-4">{student.LastName}</td>
                <td className="py-3 px-4">{student.StudentStatus}</td>
                <td className="py-3 px-4">
                  <Link
                    to={`/students/${student.StudentID}`}
                    className="flex items-center justify-center bg-transparent border border-blue-500 text-blue-500 px-4 py-2 rounded-full hover:bg-blue-500 hover:text-white hover:shadow-lg transition duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 h-5 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12H9m4 8H7a2 2 0 01-2-2V8a2 2 0 012-2h8l4 4v8a2 2 0 01-2 2z"
                      />
                    </svg>
                    ดูรายละเอียด
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          className={`px-4 py-2 rounded-lg shadow ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ก่อนหน้า
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-4 py-2 rounded-lg shadow ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
};

export default Students;
