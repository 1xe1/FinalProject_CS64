import React, { useEffect, useState, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageUserRoles = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 6; // Number of items per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/Adminstudents");
        if (response.ok) {
          const usersData = await response.json();
          setUsers(usersData);
        } else {
          setError("Failed to fetch user data");
          toast.error("Failed to fetch user data");
        }
      } catch (error) {
        setError("Error fetching user data");
        toast.error("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ฟังก์ชันแปลงค่า UserRole เป็นภาษาไทย
  const getRoleInThai = (role) => {
    switch (role) {
      case "student":
        return "นักศึกษา";
      case "teacher":
        return "อาจารย์";
      case "admin":
        return "ผู้ดูแลระบบ";
      default:
        return role;
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearchTerm =
        user.StudentID.toString().includes(searchTerm) ||
        user.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.LastName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = selectedRole ? user.UserRole === selectedRole : true;

      return matchesSearchTerm && matchesRole;
    });
  }, [users, searchTerm, selectedRole]);

  // Calculate the current items to display based on pagination
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleRoleChange = (user) => {
    setSelectedUser(user);
    setNewRole(user.UserRole);
    setShowConfirmation(true);
  };

  const handleRoleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${selectedUser.StudentID}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(
          users.map((user) =>
            user.StudentID === selectedUser.StudentID
              ? { ...user, UserRole: newRole }
              : user
          )
        );
        toast.success("บันทึกข้อมูลเรียบร้อย");
      } else {
        const errorData = await response.json();
        toast.error(`ผิดพลาดในการบันทึกข้อมูลผู้ใช้ : ${errorData.error}`);
      }
    } catch (error) {
      toast.error("แก้ไขข้อมูลผิดพลาด");
      console.error("Error:", error);
    } finally {
      setShowConfirmation(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  if (loading) {
    return <div className="p-5">Loading...</div>;
  }

  if (error) {
    return <div className="p-5 text-red-500">{error}</div>;
  }

  return (
    <div className="p-5 bg-gray-100 min-h-screen flex flex-col items-center">
      <ToastContainer />
      <h1 className="mb-8 text-4xl font-bold text-center text-gray-800">
        จัดการสิทธิ์ผู้ใช้งาน
      </h1>

      {/* Search and Role Filter */}
      <div className="flex justify-between mb-6 w-full max-w-5xl">
        <input
          type="text"
          placeholder="ค้นหา..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">ทั้งหมด</option>
          <option value="student">นักศึกษา</option>
          <option value="teacher">อาจารย์</option>
          <option value="admin">ผู้ดูแลระบบ</option>
        </select>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl p-8 mb-8">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-4 px-4 text-left">รหัสนักศึกษา</th>
              <th className="py-4 px-4 text-left">ชื่อ</th>
              <th className="py-4 px-4 text-left">นามสกุล</th>
              <th className="py-4 px-4 text-left">สิทธิ์</th>
              <th className="py-4 px-4 text-left">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 divide-y divide-gray-200">
            {currentItems.map((user) => (
              <tr key={user.StudentID} className="hover:bg-gray-50 transition">
                <td className="py-4 px-4">{user.StudentID}</td>
                <td className="py-4 px-4">{user.FirstName}</td>
                <td className="py-4 px-4">{user.LastName}</td>
                <td className="py-4 px-4">{getRoleInThai(user.UserRole)}</td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleRoleChange(user)}
                    className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200 ease-in-out"
                  >
                    แก้ไข
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mb-8 w-full max-w-5xl">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg shadow ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          ก่อนหน้า
        </button>

        {/* Center text with flex-1 */}
        <span className="flex-1 text-center text-gray-600">
          หน้าที่ {currentPage} จาก {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg shadow ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          ถัดไป
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">
              ยืนยันการเปลี่ยนสิทธิ์
            </h2>
            <p className="mb-6 text-lg text-gray-600">
              ต้องการเปลี่ยนสิทธิ์ของ คุณ{" "}
              <span className="font-semibold text-gray-800">
                {selectedUser?.FirstName}
              </span>
              ?
            </p>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="mb-6 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">นักศึกษา</option>
              <option value="teacher">อาจารย์</option>
              <option value="admin">ผู้ดูแลระบบ</option>
            </select>
            <div className="flex justify-center space-x-6">
              <button
                onClick={handleRoleSave}
                className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200 ease-in-out"
              >
                ยืนยัน
              </button>
              <button
                onClick={handleCancelConfirmation}
                className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition duration-200 ease-in-out"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUserRoles;
