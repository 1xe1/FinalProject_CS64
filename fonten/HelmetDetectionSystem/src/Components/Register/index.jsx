import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const [studentInfo, setStudentInfo] = useState({
    studentID: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    faculty: '',
    department: '',
    licensePlate: ''
  });

  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/faculties');
        const data = await response.json();
        setFaculties(data);
      } catch (error) {
        console.error('Error fetching faculties:', error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/departments');
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchFaculties();
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo({
      ...studentInfo,
      [name]: value
    });

    if (name === 'faculty') {
      const filtered = departments.filter(department => department.FacultyID === parseInt(value));
      setFilteredDepartments(filtered);
      setStudentInfo({ ...studentInfo, department: '', faculty: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (studentInfo.password !== studentInfo.confirmPassword) {
      toast.error('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentInfo)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setTimeout(() => {
          navigate('/login'); // Redirect to login after successful registration
        }, 2000); // Wait for 2 seconds before redirecting
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('เกิดข้อผิดพลาดในการลงทะเบียน');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-500 to-blue-700">
      <div className="bg-white p-10 w-full max-w-4xl rounded-lg shadow-xl text-center">
        <ToastContainer />
        <h2 className="mb-6 text-2xl font-bold text-gray-700">ลงทะเบียน</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* รหัสนักศึกษา */}
            <div className="flex flex-col">
              <label htmlFor="studentID" className="mb-2 text-left font-medium text-gray-600">รหัสนักศึกษา</label>
              <input
                type="text"
                id="studentID"
                name="studentID"
                placeholder="รหัสนักศึกษา"
                value={studentInfo.studentID}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none transition-colors"
              />
            </div>
            {/* ทะเบียนรถ */}
            <div className="flex flex-col">
              <label htmlFor="licensePlate" className="mb-2 text-left font-medium text-gray-600">หมายเลขทะเบียนรถ</label>
              <input
                type="text"
                id="licensePlate"
                name="licensePlate"
                placeholder="หมายเลขทะเบียนรถ"
                value={studentInfo.licensePlate}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none transition-colors"
              />
            </div>
            {/* ชื่อนักศึกษา */}
            <div className="flex flex-col">
              <label htmlFor="firstName" className="mb-2 text-left font-medium text-gray-600">ชื่อ</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="ชื่อ"
                value={studentInfo.firstName}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none transition-colors"
              />
            </div>
            {/* นามสกุลนักศึกษา */}
            <div className="flex flex-col">
              <label htmlFor="lastName" className="mb-2 text-left font-medium text-gray-600">นามสกุล</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="นามสกุล"
                value={studentInfo.lastName}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none transition-colors"
              />
            </div>
            
            {/* เลือกคณะ */}
            <div className="flex flex-col">
              <label htmlFor="faculty" className="mb-2 text-left font-medium text-gray-600">เลือกคณะ</label>
              <select
                id="faculty"
                name="faculty"
                value={studentInfo.faculty}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none transition-colors"
              >
                <option value="">เลือกคณะ</option>
                {faculties.map(faculty => (
                  <option key={faculty.FacultyID} value={faculty.FacultyID}>
                    {faculty.FacultyName}
                  </option>
                ))}
              </select>
            </div>
            {/* เลือกสาขาวิชา */}
            <div className="flex flex-col">
              <label htmlFor="department" className="mb-2 text-left font-medium text-gray-600">เลือกสาขา</label>
              <select
                id="department"
                name="department"
                value={studentInfo.department}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none transition-colors"
              >
                <option value="">เลือกสาขา</option>
                {filteredDepartments.map(department => (
                  <option key={department.DepartmentID} value={department.DepartmentID}>
                    {department.DepartmentName}
                  </option>
                ))}
              </select>
            </div>
            
            {/* รหัสผ่าน */}
            <div className="flex flex-col">
              <label htmlFor="password" className="mb-2 text-left font-medium text-gray-600">รหัสผ่าน</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="รหัสผ่าน"
                value={studentInfo.password}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none transition-colors"
              />
            </div>
            {/* ยืนยันรหัสผ่าน */}
            <div className="flex flex-col">
              <label htmlFor="confirmPassword" className="mb-2 text-left font-medium text-gray-600">ยืนยันรหัสผ่าน</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="ยืนยันรหัสผ่าน"
                value={studentInfo.confirmPassword}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none transition-colors"
              />
            </div>
          </div>

          {/* ปุ่มสมัครสมาชิก */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="w-full max-w-xs p-3 bg-gradient-to-r from-blue-600 to-pink-500 text-white font-semibold rounded-lg hover:bg-gradient-to-r hover:from-pink-500 hover:to-blue-600 transition-colors"
            >
              สมัครสมาชิก
            </button>
          </div>

          <Link to="/Login" className="block mt-6 text-blue-600 hover:underline">
            เข้าสู่ระบบ
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
