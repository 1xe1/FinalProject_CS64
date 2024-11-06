import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { format } from "date-fns";
import { th } from "date-fns/locale";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 6;

  const teacherID = localStorage.getItem("userID");

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/students?teacherID=${teacherID}`
        );

        const studentsData = await response.json();
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [teacherID]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) =>
      searchQuery
        ? student.FirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.LastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.StudentStatus.toLowerCase().includes(
            searchQuery.toLowerCase()
          ) ||
          student.StudentID.toString().includes(searchQuery)
        : true
    );
  }, [students, searchQuery]);

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

        <div className="relative flex justify-end">
          <input
            placeholder="Search..."
            className="input shadow-lg focus:border-2 border-gray-300 px-5 py-3 rounded-xl w-56 transition-all focus:w-64 outline-none"
            name="search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead className="bg-[#111926] text-white">
            <tr>
              <th className="py-3 px-4 text-left">รหัสนักศึกษา</th>
              <th className="py-3 px-4 text-left">ชื่อ</th>
              <th className="py-3 px-4 text-left">นามสกุล</th>
              <th className="py-3 px-4 text-left">สถานะ</th>
              <th className="py-3 px-4 text-left">การตรวจจับล่าสุด</th>
              <th className="py-3 px-4 text-left">เพิ่มเติม</th>
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
                  {student.DetectionTime
                    ? format(new Date(student.DetectionTime), "PPpp", { locale: th })
                    : "ไม่มีข้อมูลการตรวจจับ"}
                </td>
                <td className="py-3 px-4">
                  <Link
                    to={`/students/${student.StudentID}`}
                    className="flex items-center justify-center bg-transparent border border-blue-500 text-blue-500 px-4 py-2 rounded-full hover:bg-blue-500 hover:text-white hover:shadow-lg transition duration-300"
                  >
                    <FaEye />
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
