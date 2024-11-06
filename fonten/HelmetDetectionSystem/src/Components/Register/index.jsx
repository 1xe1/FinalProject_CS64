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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <ToastContainer />

      <div className="bg-white/95 backdrop-blur-sm p-8 lg:p-12 w-full max-w-4xl rounded-2xl shadow-2xl mx-4">
        <h2 className="mb-10 text-4xl font-bold text-gray-800 text-center">ลงทะเบียน</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Input fields - update the className for all input/select elements */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="studentID" className="text-sm font-semibold text-gray-700">
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
                className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            {/* หมายเลขทะเบียนรถ */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="licensePlate" className="text-sm font-semibold text-gray-700">
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
                className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            {/* ชื่อนักศึกษา */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
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
                className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            {/* นามสกุลนักศึกษา */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
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
                className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            {/* เลือกคณะ */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="faculty" className="text-sm font-semibold text-gray-700">
                เลือกคณะ
              </label>
              <select
                id="faculty"
                name="faculty"
                value={studentInfo.faculty}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
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
            <div className="flex flex-col space-y-2">
              <label htmlFor="department" className="text-sm font-semibold text-gray-700">
                เลือกสาขา
              </label>
              <select
                id="department"
                name="department"
                value={studentInfo.department}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
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
            <div className="flex flex-col space-y-2">
              <label htmlFor="teacherID" className="text-sm font-semibold text-gray-700">
                อาจารย์ที่ปรึกษา
              </label>
              <select
                id="teacherID"
                name="teacherID"
                value={studentInfo.teacherID}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
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
            <div className="flex flex-col space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700">
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
                className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            {/* ยืนยันรหัสผ่าน */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
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
                className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center space-y-6">
            <button
              type="submit"
              className="w-full max-w-md p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              สมัครสมาชิก
            </button>

            <Link
              to="/Login"
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200"
            >
              มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
