import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUser,
  FaMotorcycle,
  FaUniversity,
  FaEdit,
  FaSave,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    studentID: "",
    firstName: "",
    lastName: "",
    facultyID: "",
    departmentID: "",
    facultyName: "",
    departmentName: "",
    licensePlate: "",
  });

  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:3000/api/user/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
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
          const filtered = departments.filter(
            (department) => department.FacultyID === data.FacultyID
          );
          setFilteredDepartments(filtered);
        } else {
          toast.error("Failed to fetch user data");
        }
      } catch (error) {
        toast.error("Error fetching user data: " + error.message);
      }
    };

    const fetchFaculties = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/faculties");
        if (response.ok) {
          const data = await response.json();
          setFaculties(data);
        }
      } catch (error) {
        toast.error("Error fetching faculties: " + error.message);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/departments");
        if (response.ok) {
          const data = await response.json();
          setDepartments(data);
          const filtered = data.filter(
            (department) => department.FacultyID === userData.facultyID
          );
          setFilteredDepartments(filtered);
        }
      } catch (error) {
        toast.error("Error fetching departments: " + error.message);
      }
    };

    fetchUserData();
    fetchFaculties();
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    if (name === "facultyID") {
      const filtered = departments.filter(
        (department) => department.FacultyID === parseInt(value)
      );
      setFilteredDepartments(filtered);
      setUserData({ ...userData, departmentID: "", facultyID: value });
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
        toast.success("ข้อมูลถูกบันทึกแล้ว");
        localStorage.setItem(
          "studentName",
          `${userData.firstName} ${userData.lastName}`
        );
        setEditing(false);
      } else {
        toast.error("Failed to save user data");
      }
    } catch (error) {
      toast.error("Error saving user data: " + error.message);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b f min-h-screen flex flex-col items-center">
      <ToastContainer />

      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-5xl text-gray-800 font-extrabold text-center mb-4">
          ข้อมูลส่วนตัว
        </h1>
        <div className="h-1 w-24 bg-blue-500 mx-auto rounded"></div>
      </div>

      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg border border-gray-300">
        {/* Profile Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
            <FaUser className="mr-2 text-gray-800" /> ข้อมูลส่วนตัว
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อ:
              </label>
              <input
                type="text"
                name="firstName"
                value={userData.firstName}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full p-3 border ${
                  editing ? "border-gray-300" : "border-gray-200"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                นามสกุล:
              </label>
              <input
                type="text"
                name="lastName"
                value={userData.lastName}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full p-3 border ${
                  editing ? "border-gray-300" : "border-gray-200"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
            </div>
          </div>
        </div>

        {/* Vehicle Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
            <FaMotorcycle className="mr-2 text-gray-800" /> ข้อมูลรถยนต์
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ป้ายทะเบียนรถ:
            </label>
            <input
              type="text"
              name="licensePlate"
              value={userData.licensePlate}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full p-3 border ${
                editing ? "border-gray-300" : "border-gray-200"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
          </div>
        </div>

        {/* Academic Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
            <FaUniversity className="mr-2 text-gray-800" /> ข้อมูลคณะและสาขา
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                คณะ:
              </label>
              <select
                name="facultyID"
                value={userData.facultyID}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full p-3 border ${
                  editing ? "border-gray-300" : "border-gray-200"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
              >
                <option value="" disabled>
                  {userData.facultyName || "เลือกคณะ"}
                </option>
                {faculties.map((faculty) => (
                  <option key={faculty.FacultyID} value={faculty.FacultyID}>
                    {faculty.FacultyName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สาขาวิชา:
              </label>
              <select
                name="departmentID"
                value={userData.departmentID}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full p-3 border ${
                  editing ? "border-gray-300" : "border-gray-200"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
              >
                <option value="" disabled>
                  {userData.departmentName || "เลือกสาขาวิชา"}
                </option>
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

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          {editing ? (
            <>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-blue-600 flex items-center"
                onClick={handleSave}
              >
                <FaSave className="mr-2" /> บันทึก
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-red-600 flex items-center"
                onClick={() => setEditing(false)}
              >
                <FaTimes className="mr-2" /> ยกเลิก
              </button>
            </>
          ) : (
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-yellow-600 flex items-center"
              onClick={() => setEditing(true)}
            >
              <FaEdit className="mr-2" /> แก้ไขข้อมูล
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
