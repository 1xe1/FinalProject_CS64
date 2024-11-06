import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSave, FaTimesCircle } from "react-icons/fa";

const AddTeacher = () => {
  const [newTeacher, setNewTeacher] = useState({
    TeacherID: "",
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    FacultyID: "", // Set FacultyID here for correct mapping
    DepartmentID: "", // Set DepartmentID here for correct mapping
  });
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const navigate = useNavigate();

  // Fetch faculties and all departments on component mount
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/faculties");
        const data = await response.json();
        setFaculties(data);
      } catch (error) {
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลคณะ");
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/departments");
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลสาขา");
      }
    };

    fetchFaculties();
    fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prev) => ({ ...prev, [name]: value }));

    // If faculty is selected, update departments to match the selected faculty
    if (name === "FacultyID") {
      const filtered = departments.filter(
        (department) => department.FacultyID === parseInt(value)
      );
      setFilteredDepartments(filtered);
      setNewTeacher((prev) => ({ ...prev, DepartmentID: "" })); // Reset department selection
    }
  };

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
        toast.success("เพิ่มข้อมูลอาจารย์เรียบร้อยแล้ว");
        navigate("/TeachersList");
      } else {
        toast.error("ไม่สามารถเพิ่มข้อมูลอาจารย์ได้");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูลอาจารย์");
    }
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen flex flex-col items-center">
      <ToastContainer />
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        เพิ่มข้อมูลอาจารย์
        </h1>
      </div>
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
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
          <input
            type="password"
            name="Password"
            placeholder="รหัสผ่าน"
            value={newTeacher.Password}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg"
          />

          {/* Faculty Dropdown */}
          <select
            name="FacultyID"
            value={newTeacher.FacultyID}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg"
          >
            <option value="">เลือกคณะ</option>
            {faculties.map((faculty) => (
              <option key={faculty.FacultyID} value={faculty.FacultyID}>
                {faculty.FacultyName}
              </option>
            ))}
          </select>

          {/* Department Dropdown - Filtered by selected Faculty */}
          <select
            name="DepartmentID"
            value={newTeacher.DepartmentID}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg"
            disabled={!newTeacher.FacultyID} // Disable if no faculty selected
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
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleAddTeacher}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200 ease-in-out flex items-center gap-2 shadow-md"
          >
            <FaSave className="text-xl" />
            <span>บันทึก</span>
          </button>
          <button
            onClick={() => navigate("/TeachersList")}
            className="px-6 py-2.5 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition duration-200 ease-in-out flex items-center gap-2 shadow-md"
          >
            <FaTimesCircle className="text-xl" />
            <span>ยกเลิก</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTeacher;
