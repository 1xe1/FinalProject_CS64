import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [studentInfo, setStudentInfo] = useState({
    studentID: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    faculty: "",
    department: "",
    licensePlate: "",
    teacherID: "", // Add teacherID to the state
  });

  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/faculties");
        const data = await response.json();
        setFaculties(data);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/departments");
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchFaculties();
    fetchDepartments();
  }, []);

  const fetchTeachers = async (facultyID, departmentID) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/teachers?facultyID=${facultyID}&departmentID=${departmentID}`
      );
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo({
      ...studentInfo,
      [name]: value,
    });

    if (name === "faculty") {
      const filtered = departments.filter(
        (department) => department.FacultyID === parseInt(value)
      );
      setFilteredDepartments(filtered);
      setStudentInfo({ ...studentInfo, department: "", faculty: value });

      // Fetch teachers filtered by faculty when faculty is selected
      fetchTeachers(value, "");
    }

    if (name === "department") {
      setStudentInfo({ ...studentInfo, department: value });
      fetchTeachers(studentInfo.faculty, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (studentInfo.password !== studentInfo.confirmPassword) {
      toast.error("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentInfo),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("เกิดข้อผิดพลาดในการลงทะเบียน");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-500 to-blue-700">
      <div className="bg-white p-10 w-full max-w-4xl rounded-lg shadow-xl">
        <ToastContainer />
        <h2 className="mb-8 text-3xl font-bold text-gray-700 text-center">ลงทะเบียน</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* รหัสนักศึกษา */}
            <div className="flex flex-col">
              <label htmlFor="studentID" className="mb-2 font-medium text-gray-600">
                รหัสนักศึกษา
              </label>
              <input
                type="text"
                id="studentID"
                name="studentID"
                placeholder="รหัสนักศึกษา"
                value={studentInfo.studentID}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) && value.length <= 9) {
                    handleChange(e);
                  }
                }}
                required
                pattern="\d{9}"
                title="กรุณากรอกตัวเลข 9 ตัว"
                className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
              />
            </div>

            {/* หมายเลขทะเบียนรถ */}
            <div className="flex flex-col">
              <label htmlFor="licensePlate" className="mb-2 font-medium text-gray-600">
                หมายเลขทะเบียนรถ
              </label>
              <input
                type="text"
                id="licensePlate"
                name="licensePlate"
                placeholder="หมายเลขทะเบียนรถ"
                value={studentInfo.licensePlate}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
              />
            </div>

            {/* ชื่อนักศึกษา */}
            <div className="flex flex-col">
              <label htmlFor="firstName" className="mb-2 font-medium text-gray-600">
                ชื่อ
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="ชื่อ"
                value={studentInfo.firstName}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
              />
            </div>

            {/* นามสกุลนักศึกษา */}
            <div className="flex flex-col">
              <label htmlFor="lastName" className="mb-2 font-medium text-gray-600">
                นามสกุล
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="นามสกุล"
                value={studentInfo.lastName}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
              />
            </div>

            {/* เลือกคณะ */}
            <div className="flex flex-col">
              <label htmlFor="faculty" className="mb-2 font-medium text-gray-600">
                เลือกคณะ
              </label>
              <select
                id="faculty"
                name="faculty"
                value={studentInfo.faculty}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
              >
                <option value="">เลือกคณะ</option>
                {faculties.map((faculty) => (
                  <option key={faculty.FacultyID} value={faculty.FacultyID}>
                    {faculty.FacultyName}
                  </option>
                ))}
              </select>
            </div>

            {/* เลือกสาขาวิชา */}
            <div className="flex flex-col">
              <label htmlFor="department" className="mb-2 font-medium text-gray-600">
                เลือกสาขา
              </label>
              <select
                id="department"
                name="department"
                value={studentInfo.department}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
              >
                <option value="">เลือกสาขา</option>
                {filteredDepartments.map((department) => (
                  <option key={department.DepartmentID} value={department.DepartmentID}>
                    {department.DepartmentName}
                  </option>
                ))}
              </select>
            </div>

            {/* อาจารย์ที่ปรึกษา */}
            <div className="flex flex-col">
              <label htmlFor="teacherID" className="mb-2 font-medium text-gray-600">
                อาจารย์ที่ปรึกษา
              </label>
              <select
                id="teacherID"
                name="teacherID"
                value={studentInfo.teacherID}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
              >
                <option value="">เลือกอาจารย์ที่ปรึกษา</option>
                {teachers.map((teacher) => (
                  <option key={teacher.TeacherID} value={teacher.TeacherID}>
                    {teacher.FirstName} {teacher.LastName}
                  </option>
                ))}
              </select>
            </div>

            {/* รหัสผ่าน */}
            <div className="flex flex-col">
              <label htmlFor="password" className="mb-2 font-medium text-gray-600">
                รหัสผ่าน
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="รหัสผ่าน"
                value={studentInfo.password}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
              />
            </div>

            {/* ยืนยันรหัสผ่าน */}
            <div className="flex flex-col">
              <label htmlFor="confirmPassword" className="mb-2 font-medium text-gray-600">
                ยืนยันรหัสผ่าน
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="ยืนยันรหัสผ่าน"
                value={studentInfo.confirmPassword}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="w-full max-w-xs p-3 bg-gradient-to-r from-blue-600 to-pink-500 text-white font-semibold rounded-lg hover:bg-gradient-to-r hover:from-pink-500 hover:to-blue-600 transition-colors"
            >
              สมัครสมาชิก
            </button>
          </div>

          <Link
            to="/Login"
            className="block mt-6 text-blue-600 hover:underline text-center"
          >
            เข้าสู่ระบบ
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
