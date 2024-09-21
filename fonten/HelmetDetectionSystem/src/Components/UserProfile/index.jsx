import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    studentID: '',
    firstName: '',
    lastName: '',
    facultyID: '',
    departmentID: '',
    facultyName: '',
    departmentName: '',
    licensePlate: '',
  });

  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]); // สำหรับเก็บสาขาที่กรองตาม FacultyID
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:3000/api/user/profile', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData({
            studentID: data.StudentID,
            firstName: data.FirstName,
            lastName: data.LastName,
            facultyID: data.FacultyID,
            departmentID: data.DepartmentID,
            facultyName: data.FacultyName,
            departmentName: data.DepartmentName,
            licensePlate: data.LicensePlate,
          });
          // กรองสาขาตาม FacultyID ของผู้ใช้
          const filtered = departments.filter(department => department.FacultyID === data.FacultyID);
          setFilteredDepartments(filtered);
        } else {
          toast.error('Failed to fetch user data');
        }
      } catch (error) {
        toast.error('Error fetching user data: ' + error.message);
      }
    };

    const fetchFaculties = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/faculties');
        if (response.ok) {
          const data = await response.json();
          setFaculties(data);
        }
      } catch (error) {
        toast.error('Error fetching faculties: ' + error.message);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/departments');
        if (response.ok) {
          const data = await response.json();
          setDepartments(data);
          // กรองสาขาตาม FacultyID ของผู้ใช้หลังจากดึงข้อมูลเสร็จ
          const filtered = data.filter(department => department.FacultyID === userData.facultyID);
          setFilteredDepartments(filtered);
        }
      } catch (error) {
        toast.error('Error fetching departments: ' + error.message);
      }
    };

    fetchUserData();
    fetchFaculties();
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    // กรองสาขาตาม FacultyID เมื่อเลือกคณะ
    if (name === 'facultyID') {
      const filtered = departments.filter(department => department.FacultyID === parseInt(value));
      setFilteredDepartments(filtered);
      setUserData({ ...userData, departmentID: '', facultyID: value }); // รีเซ็ต departmentID เมื่อ FacultyID เปลี่ยน
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          licensePlate: userData.licensePlate,
          facultyID: userData.facultyID,
          departmentID: userData.departmentID,
        }),
      });

      if (response.ok) {
        toast.success('ข้อมูลถูกบันทึกแล้ว');
        localStorage.setItem('studentName', `${userData.firstName} ${userData.lastName}`);
        setEditing(false);
      } else {
        toast.error('Failed to save user data');
      }
    } catch (error) {
      toast.error('Error saving user data: ' + error.message);
    }
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen flex flex-col items-center">
      <ToastContainer />
      <h1 className="mb-5 text-4xl text-gray-800 font-semibold">ข้อมูลส่วนตัว</h1>
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">รหัสนักศึกษา:</label>
            <input
              type="text"
              value={userData.studentID}
              disabled
              className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">ป้ายทะเบียนรถ:</label>
            <input
              type="text"
              name="licensePlate"
              value={userData.licensePlate}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full mt-2 p-3 border ${editing ? 'border-gray-300' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">ชื่อ:</label>
            <input
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full mt-2 p-3 border ${editing ? 'border-gray-300' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">นามสกุล:</label>
            <input
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full mt-2 p-3 border ${editing ? 'border-gray-300' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">คณะ:</label>
            <select
              name="facultyID"
              value={userData.facultyID}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full mt-2 p-3 border ${editing ? 'border-gray-300' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            >
              <option value="" disabled>{userData.facultyName}</option>
              {faculties.map((faculty) => (
                <option key={faculty.FacultyID} value={faculty.FacultyID}>
                  {faculty.FacultyName}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">สาขาวิชา:</label>
            <select
              name="departmentID"
              value={userData.departmentID}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full mt-2 p-3 border ${editing ? 'border-gray-300' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            >
              <option value="" disabled>{userData.departmentName}</option>
              {filteredDepartments.map((department) => (
                <option key={department.DepartmentID} value={department.DepartmentID}>
                  {department.DepartmentName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {editing ? (
          <div className="flex justify-end mt-6">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 transition duration-300 hover:bg-blue-600"
              onClick={handleSave}
            >
              บันทึก
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-gray-600"
              onClick={() => setEditing(false)}
            >
              ยกเลิก
            </button>
          </div>
        ) : (
          <div className="flex justify-end mt-6">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-green-600"
              onClick={() => setEditing(true)}
            >
              แก้ไขข้อมูล
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
