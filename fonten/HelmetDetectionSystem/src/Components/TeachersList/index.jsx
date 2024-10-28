import React, { useEffect, useState, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    TeacherID: "",
    FirstName: "",
    LastName: "",
    Email: "",
    Faculty: "",
    Department: ""
  });
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/Adminteachers");
        if (response.ok) {
          const teachersData = await response.json();
          setTeachers(teachersData);

          const facultiesList = [...new Set(teachersData.map((teacher) => teacher.Faculty))];
          setFaculties(facultiesList);

          const departmentsList = [...new Set(teachersData.map((teacher) => teacher.Department))];
          setDepartments(departmentsList);

        } else {
          setError("ไม่สามารถดึงข้อมูลรายชื่ออาจารย์ได้");
          toast.error("ไม่สามารถดึงข้อมูลรายชื่ออาจารย์ได้");
        }
      } catch (error) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูลรายชื่ออาจารย์");
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลรายชื่ออาจารย์");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleAddTeacher = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/Adminteachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTeacher),
      });

      if (response.ok) {
        const addedTeacher = await response.json();
        setTeachers((prev) => [...prev, addedTeacher]);
        toast.success("เพิ่มข้อมูลอาจารย์เรียบร้อยแล้ว");
        setShowAddForm(false);
        setNewTeacher({
          TeacherID: "",
          FirstName: "",
          LastName: "",
          Email: "",
          Faculty: "",
          Department: ""
        });
      } else {
        toast.error("ไม่สามารถเพิ่มข้อมูลอาจารย์ได้");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูลอาจารย์");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const matchesSearchTerm =
        teacher.TeacherID.includes(searchTerm) ||
        teacher.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.LastName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFaculty = selectedFaculty ? teacher.Faculty === selectedFaculty : true;
      const matchesDepartment = selectedDepartment ? teacher.Department === selectedDepartment : true;

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
      direction === "next" ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
    );
  };

  if (loading) return <div className="p-5">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="p-5 text-red-500">{error}</div>;

  return (
    <div className="p-5 bg-gray-100 min-h-screen flex flex-col items-center">
      <ToastContainer />
      <h1 className="mb-8 text-4xl font-bold text-center text-gray-800">รายชื่ออาจารย์</h1>

      <div className="flex justify-between mb-6 w-full max-w-5xl">
        <input
          type="text"
          placeholder="ค้นหา..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={selectedFaculty}
          onChange={(e) => setSelectedFaculty(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">เลือกคณะ</option>
          {faculties.map((faculty, index) => (
            <option key={index} value={faculty}>
              {faculty}
            </option>
          ))}
        </select>

        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">เลือกสาขา</option>
          {departments.map((department, index) => (
            <option key={index} value={department}>
              {department}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl p-8 mb-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200 ease-in-out"
          >
            {showAddForm ? "ยกเลิกการเพิ่ม" : "เพิ่มข้อมูลอาจารย์"}
          </button>
        </div>

        {showAddForm ? (
          <div className="w-full bg-gray-50 p-5 rounded-lg mb-5">
            <h2 className="text-xl font-bold mb-4">เพิ่มข้อมูลอาจารย์ใหม่</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="TeacherID"
                placeholder="รหัสอาจารย์"
                value={newTeacher.TeacherID}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="FirstName"
                placeholder="ชื่อ"
                value={newTeacher.FirstName}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="LastName"
                placeholder="นามสกุล"
                value={newTeacher.LastName}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="email"
                name="Email"
                placeholder="อีเมล"
                value={newTeacher.Email}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-lg"
              />
              <select
                name="Faculty"
                value={newTeacher.Faculty}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-lg"
              >
                <option value="">เลือกคณะ</option>
                {faculties.map((faculty, index) => (
                  <option key={index} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </select>
              <select
                name="Department"
                value={newTeacher.Department}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-lg"
              >
                <option value="">เลือกสาขา</option>
                {departments.map((department, index) => (
                  <option key={index} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddTeacher}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200 ease-in-out"
            >
              บันทึกข้อมูลอาจารย์
            </button>
          </div>
        ) : (
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-4 px-4 text-left">รหัสอาจารย์</th>
                <th className="py-4 px-4 text-left">ชื่อ</th>
                <th className="py-4 px-4 text-left">นามสกุล</th>
                <th className="py-4 px-4 text-left">อีเมล</th>
                <th className="py-4 px-4 text-left">คณะ</th>
                <th className="py-4 px-4 text-left">สาขา</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-200">
              {currentItems.map((teacher) => (
                <tr key={teacher.TeacherID} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-4">{teacher.TeacherID}</td>
                  <td className="py-4 px-4">{teacher.FirstName}</td>
                  <td className="py-4 px-4">{teacher.LastName}</td>
                  <td className="py-4 px-4">{teacher.Email}</td>
                  <td className="py-4 px-4">{teacher.Faculty}</td>
                  <td className="py-4 px-4">{teacher.Department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-between items-center mb-8 w-full max-w-5xl">
        <button
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg shadow ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          ก่อนหน้า
        </button>

        <span className="flex-1 text-center text-gray-600">
          หน้าที่ {currentPage} จาก {totalPages}
        </span>

        <button
          onClick={() => handlePageChange("next")}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg shadow ${
            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
};

export default TeachersList;
