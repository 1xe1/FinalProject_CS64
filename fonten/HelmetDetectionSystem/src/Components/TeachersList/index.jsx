import React, { useEffect, useState, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersResponse = await fetch(
          "http://localhost:3000/api/Adminteachers"
        );
        const facultiesResponse = await fetch(
          "http://localhost:3000/api/faculties"
        );
        const departmentsResponse = await fetch(
          "http://localhost:3000/api/departments"
        );

        if (
          teachersResponse.ok &&
          facultiesResponse.ok &&
          departmentsResponse.ok
        ) {
          const teachersData = await teachersResponse.json();
          const facultiesData = await facultiesResponse.json();
          const departmentsData = await departmentsResponse.json();

          setTeachers(teachersData);
          setFaculties(facultiesData);
          setDepartments(departmentsData);
        } else {
          setError("ไม่สามารถดึงข้อมูลได้");
          toast.error("ไม่สามารถดึงข้อมูลได้");
        }
      } catch (error) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
        toast.error("เกิดข้อผิดพลาดในการดึข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedFaculty) {
      const filtered = departments.filter(
        (dep) => dep.FacultyID === parseInt(selectedFaculty)
      );
      setFilteredDepartments(filtered);
      setSelectedDepartment("");
    } else {
      setFilteredDepartments([]);
    }
  }, [selectedFaculty, departments]);

  // Memoized filter logic to filter teachers based on search term, faculty, and department
  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const matchesSearchTerm =
        teacher.TeacherID.includes(searchTerm) ||
        teacher.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.LastName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFaculty = selectedFaculty
        ? teacher.FacultyID === parseInt(selectedFaculty)
        : true;
      const matchesDepartment = selectedDepartment
        ? teacher.DepartmentID === parseInt(selectedDepartment)
        : true;

      return matchesSearchTerm && matchesFaculty && matchesDepartment;
    });
  }, [teachers, searchTerm, selectedFaculty, selectedDepartment]);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTeachers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTeachers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      direction === "next"
        ? Math.min(prev + 1, totalPages)
        : Math.max(prev - 1, 1)
    );
  };

  const handleEditClick = (teacher) => {
    setEditingTeacher(teacher);
    setFilteredDepartments(
      departments.filter((dep) => dep.FacultyID === teacher.FacultyID)
    );
  };

  const handleUpdateTeacher = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/Adminteachers/${editingTeacher.TeacherID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingTeacher),
        }
      );

      if (response.ok) {
        toast.success("ข้อมูลอาจารย์ได้รับการแก้ไขแล้ว");

        const updatedTeachersResponse = await fetch(
          "http://localhost:3000/api/Adminteachers"
        );
        if (updatedTeachersResponse.ok) {
          const updatedTeachersData = await updatedTeachersResponse.json();
          setTeachers(updatedTeachersData);
        }
        setEditingTeacher(null);
      } else {
        toast.error("ไม่สามารถแก้ไขข้อมูลอาจารย์ได้");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูลอาจารย์");
    }
  };

  const handleDeleteClick = (teacherID) => {
    setTeacherToDelete(teacherID);
    setShowDeleteModal(true);
  };

  const confirmDeleteTeacher = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/Adminteachers/${teacherToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("ลบข้อมูลอาจารย์เรียบร้อยแล้ว");
        setTeachers(
          teachers.filter((teacher) => teacher.TeacherID !== teacherToDelete)
        );
        setShowDeleteModal(false);
      } else {
        toast.error("ไม่สามารถลบข้อมูลอาจารย์ได้");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูลอาจารย์");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTeacherToDelete(null);
  };

  if (loading) return <div className="p-5">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="p-5 text-red-500">{error}</div>;

  return (
    <div className="p-5 bg-gray-100 min-h-screen flex flex-col items-center">
      <ToastContainer />

      <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          รายชื่ออาจารย์
        </h1>
      </div>
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl p-8 mb-8">
        <div className="flex justify-between mb-6 w-full max-w-5xl">
          <div className="relative">
            <input
              type="search"
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input shadow-lg focus:border-2 border-gray-300 px-5 py-3 rounded-xl w-56 transition-all focus:w-64 outline-none"
              name="search"
            />
            <svg
              className="size-6 absolute top-3 right-3 text-gray-500"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
            </svg>
          </div>

          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">เลือกคณะ</option>
            {faculties.map((faculty) => (
              <option key={faculty.FacultyID} value={faculty.FacultyID}>
                {faculty.FacultyName}
              </option>
            ))}
          </select>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">เลือกสาขา</option>
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
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/AddTeacher")}
            className="px-6 py-3 bg-green-700 text-white rounded-full hover:bg-green-600 
            transition-all duration-200 flex items-center gap-2 shadow-lg 
            hover:shadow-green-500/50 hover:-translate-y-1 font-semibold"
          >
            <FaUserPlus className="text-xl" />
            เพิ่มข้อมูล
          </button>
        </div>

        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white">
              {/* <th className="py-4 px-4 text-left">รหัสอาจารย์</th> */}
              <th className="py-4 px-4 text-left">ชื่อ</th>
              <th className="py-4 px-4 text-left">นามสกุล</th>
              <th className="py-4 px-4 text-left">อีเมล</th>
              <th className="py-4 px-4 text-left">คณะ</th>
              <th className="py-4 px-4 text-left">สาขา</th>
              <th className="py-4 px-4 text-left">จัดการ</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 divide-y divide-gray-200">
            {currentItems.map((teacher) => (
              <tr
                key={teacher.TeacherID}
                className="hover:bg-gray-50 transition"
              >
                {/* <td className="py-4 px-4">{teacher.TeacherID}</td> */}
                <td className="py-4 px-4">{teacher.FirstName}</td>
                <td className="py-4 px-4">{teacher.LastName}</td>
                <td className="py-4 px-4">{teacher.Email}</td>
                <td className="py-4 px-4">{teacher.Faculty}</td>
                <td className="py-4 px-4">{teacher.Department}</td>
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(teacher)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 hover:-translate-y-1"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(teacher.TeacherID)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all duration-200 hover:-translate-y-1"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Form */}
      {editingTeacher && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-lg">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
              แก้ไขข้อมูลอาจารย์
            </h2>

            <input
              type="text"
              name="FirstName"
              value={editingTeacher.FirstName}
              onChange={(e) =>
                setEditingTeacher({
                  ...editingTeacher,
                  FirstName: e.target.value,
                })
              }
              className="mb-4 p-4 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              placeholder="ชื่อ"
            />

            <input
              type="text"
              name="LastName"
              value={editingTeacher.LastName}
              onChange={(e) =>
                setEditingTeacher({
                  ...editingTeacher,
                  LastName: e.target.value,
                })
              }
              className="mb-4 p-4 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              placeholder="นามสกุล"
            />

            <input
              type="email"
              name="Email"
              value={editingTeacher.Email}
              onChange={(e) =>
                setEditingTeacher({
                  ...editingTeacher,
                  Email: e.target.value,
                })
              }
              className="mb-4 p-4 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              placeholder="อีเมล"
            />

            <select
              value={editingTeacher.FacultyID}
              onChange={(e) => {
                setEditingTeacher({
                  ...editingTeacher,
                  FacultyID: parseInt(e.target.value),
                });
                setFilteredDepartments(
                  departments.filter(
                    (dep) => dep.FacultyID === parseInt(e.target.value)
                  )
                );
              }}
              className="mb-4 p-4 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            >
              <option value="">เลือกคณะ</option>
              {faculties.map((faculty) => (
                <option key={faculty.FacultyID} value={faculty.FacultyID}>
                  {faculty.FacultyName}
                </option>
              ))}
            </select>

            <select
              value={editingTeacher.DepartmentID}
              onChange={(e) =>
                setEditingTeacher({
                  ...editingTeacher,
                  DepartmentID: parseInt(e.target.value),
                })
              }
              className="mb-6 p-4 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            >
              <option value="">เลือกสาขา</option>
              {filteredDepartments.map((department) => (
                <option
                  key={department.DepartmentID}
                  value={department.DepartmentID}
                >
                  {department.DepartmentName}
                </option>
              ))}
            </select>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleUpdateTeacher}
                className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 hover:-translate-y-1"
              >
                <FaSave />
                บันทึก
              </button>
              <button
                onClick={() => setEditingTeacher(null)}
                className="px-6 py-3 bg-gray-500 text-white rounded-full font-semibold shadow-md hover:bg-gray-600 transition-all duration-200 flex items-center gap-2 hover:-translate-y-1"
              >
                <FaTimes />
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transition-transform transform scale-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              ต้องการลบข้อมูลอาจารย์?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDeleteTeacher}
                className="px-8 py-3 bg-red-500 text-white font-semibold rounded-full shadow-md hover:bg-red-600 transition-all duration-200 flex items-center gap-2 hover:-translate-y-1"
              >
                <FaTrash />
                ยืนยัน
              </button>
              <button
                onClick={cancelDelete}
                className="px-8 py-3 bg-gray-400 text-white font-semibold rounded-full shadow-md hover:bg-gray-500 transition-all duration-200 flex items-center gap-2 hover:-translate-y-1"
              >
                <FaTimes />
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8 w-full max-w-5xl">
        <button
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg shadow-md flex items-center gap-2 ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 hover:-translate-y-1"
          }`}
        >
          <FaChevronLeft />
          ก่อนหน้า
        </button>

        <span className="flex-1 text-center text-gray-600">
          หน้าที่ {currentPage} จาก {totalPages}
        </span>

        <button
          onClick={() => handlePageChange("next")}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg shadow-md flex items-center gap-2 ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 hover:-translate-y-1"
          }`}
        >
          ถัดไป
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default TeachersList;
