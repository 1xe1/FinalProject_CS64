import React, { useEffect, useState, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegCheckSquare, FaUndo } from "react-icons/fa";

const ApproveUserRegistrations = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("รอการอนุมัติ");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchPendingRegistrations = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/pendingRegistrations?status=${selectedStatus}`);
        if (response.ok) {
          const usersData = await response.json();
          setUsers(usersData);
        } else {
          setError("ไม่สามารถดึงข้อมูลการสมัครที่รอการอนุมัติได้");
          toast.error("ไม่สามารถดึงข้อมูลการสมัครที่รอการอนุมัติได้");
        }
      } catch (error) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูลการสมัครที่รอการอนุมัติ");
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลการสมัครที่รอการอนุมัติ");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRegistrations();
  }, [selectedStatus]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearchTerm =
        user.StudentID.toString().includes(searchTerm) ||
        user.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.LastName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus
        ? user.StudentStatus === selectedStatus
        : true;

      return matchesSearchTerm && matchesStatus;
    });
  }, [users, searchTerm, selectedStatus]);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleApprove = (user) => {
    setSelectedUser(user);
    setShowConfirmation(true);
  };

  const handleApproveSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/students/${selectedUser.StudentID}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.StudentID !== selectedUser.StudentID));
        toast.success("อนุมัตินักศึกษาเรียบร้อยแล้ว");
      } else {
        const errorData = await response.json();
        toast.error(`เกิดข้อผิดพลาดในการอนุมัตินักศึกษา: ${errorData.error}`);
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการอนุมัตินักศึกษา");
      console.error("Error:", error);
    } finally {
      setShowConfirmation(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === currentItems.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentItems.map((user) => user.StudentID));
    }
  };

  const handleApproveSelected = async () => {
    try {
      const promises = selectedUsers.map((userId) =>
        fetch(`http://localhost:3000/api/students/${userId}/approve`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        })
      );

      const responses = await Promise.all(promises);
      const successfulApprovals = responses.filter((response) => response.ok);

      if (successfulApprovals.length > 0) {
        setUsers(users.filter((user) => !selectedUsers.includes(user.StudentID)));
        toast.success("อนุมัตินักศึกษาที่เลือกเรียบร้อยแล้ว");
      } else {
        toast.error("เกิดข้อผิดพลาดในการอนุมัตินักศึกษาที่เลือก");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการอนุมัตินักศึกษาที่เลือก");
      console.error("Error:", error);
    } finally {
      setSelectedUsers([]);
    }
  };

  const handleChangeStatus = async (user, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/students/${user.StudentID}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newStatus }),
      });

      if (response.ok) {
        setUsers(users.map((u) => 
          u.StudentID === user.StudentID ? { ...u, StudentStatus: newStatus } : u
        ));
        toast.success(`สถานะนักศึกษาเปลี่ยนเป็น '${newStatus}' เรียบร้อยแล้ว`);
      } else {
        const errorData = await response.json();
        toast.error(`เกิดข้อผิดพลาดในการเปลี่ยนสถานะนักศึกษา: ${errorData.error}`);
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเปลี่ยนสถานะนักศึกษา");
      console.error("Error:", error);
    }
  };

  const handleRevertStatus = async (user) => {
    try {
      const response = await fetch(`http://localhost:3000/api/students/${user.StudentID}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newStatus: "รอการอนุมัติ" }),
      });

      if (response.ok) {
        setUsers(users.map((u) => 
          u.StudentID === user.StudentID ? { ...u, StudentStatus: "รอการอนุมัติ" } : u
        ));
        toast.success(`สถานะนักศึกษาเปลี่ยนเป็น 'รอการอนุมัติ' เรียบร้อยแล้ว`);
      } else {
        const errorData = await response.json();
        toast.error(`เกิดข้อผิดพลาดในการเปลี่ยนสถานะนักศึกษา: ${errorData.error}`);
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเปลี่ยนสถานะนักศึกษา");
      console.error("Error:", error);
    }
  };

  const handleRevertSelectedStatus = async () => {
    try {
      const promises = selectedUsers.map((userId) =>
        fetch(`http://localhost:3000/api/students/${userId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newStatus: "รอการอนุมัติ" }),
        })
      );

      const responses = await Promise.all(promises);
      const successfulReverts = responses.filter((response) => response.ok);

      if (successfulReverts.length > 0) {
        setUsers(users.map((user) =>
          selectedUsers.includes(user.StudentID)
            ? { ...user, StudentStatus: "รอการอนุมัติ" }
            : user
        ));
        toast.success("สถานะนักศึกษาที่เลือกเปลี่ยนเป็น 'รอการอนุมัติ' เรียบร้อยแล้ว");
      } else {
        toast.error("เกิดข้อผิดพลาดในการเปลี่ยนสถานะนักศึกษาที่เลือก");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเปลี่ยนสถานะนักศึกษาที่เลือก");
      console.error("Error:", error);
    } finally {
      setSelectedUsers([]);
    }
  };

  if (loading) {
    return <div className="p-5">กำลังโหลดข้อมูล...</div>;
  }

  if (error) {
    return <div className="p-5 text-red-500">{error}</div>;
  }

  return (
    <div className="p-5 bg-gray-100 min-h-screen flex flex-col items-center">
      <ToastContainer />
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          อนุมัติการสมัครสมาชิก
        </h1>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl p-8 mb-8">
        <div className="relative flex justify-between mb-5">
          <input
            placeholder="ค้นหา..."
            className="input shadow-lg focus:border-2 border-gray-300 px-5 py-3 rounded-xl w-56 transition-all focus:w-64 outline-none"
            name="search"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="รอการอนุมัติ">รอการอนุมัติ</option>
            <option value="กำลังศึกษา">กำลังศึกษา</option>
            <option value="ออกจากการศึกษา">ออกจากการศึกษา</option>
          </select>
        </div>

        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-4 px-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === currentItems.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="py-4 px-4 text-left">รหัสนักศึกษา</th>
              <th className="py-4 px-4 text-left">ชื่อ</th>
              <th className="py-4 px-4 text-left">นามสกุล</th>
              <th className="py-4 px-4 text-left">สถานะ</th>
              <th className="py-4 px-4 text-left">ดำเนินการ</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 divide-y divide-gray-200">
            {currentItems.map((user) => (
              <tr key={user.StudentID} className="hover:bg-gray-50 transition">
                <td className="py-4 px-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.StudentID)}
                    onChange={() => handleSelectUser(user.StudentID)}
                  />
                </td>
                <td className="py-4 px-4">{user.StudentID}</td>
                <td className="py-4 px-4">{user.FirstName}</td>
                <td className="py-4 px-4">{user.LastName}</td>
                <td className="py-4 px-4">{user.StudentStatus}</td>
                <td className="py-4 px-4">
                  {selectedStatus === "กำลังศึกษา" || selectedStatus === "ออกจากการศึกษา" ? (
                    <button
                      onClick={() => handleRevertStatus(user)}
                      className="flex items-center px-6 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-400 transition duration-200 ease-in-out"
                      aria-label="เปลี่ยนสถานะเป็นรอการอนุมัติ"
                    >
                      <FaUndo className="mr-2" />
                      รอการอนุมัติ
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprove(user)}
                      className="flex items-center px-6 py-2 bg-green-700 text-white rounded-full hover:bg-green-600 transition duration-200 ease-in-out"
                      aria-label="อนุมัติการสมัคร"
                    >
                      <FaRegCheckSquare className="mr-2" />
                      อนุมัติ
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={
            selectedStatus === "กำลังศึกษา" || selectedStatus === "ออกจากการศึกษา"
              ? handleRevertSelectedStatus
              : handleApproveSelected
          }
          disabled={selectedUsers.length === 0}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition duration-200 ease-in-out flex items-center justify-center"
        >
          {selectedStatus === "กำลังศึกษา" || selectedStatus === "ออกจากการศึกษา" ? (
            <>
              <FaUndo className="mr-2" />
              แก้ไขเป็นรอการอนุมัติ
            </>
          ) : (
            <>
              <FaRegCheckSquare className="mr-2" />
              อนุมัติทั้งหมดที่เลือก
            </>
          )}
        </button>
      </div>

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

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">
              ยืนยันการอนุมัติ
            </h2>
            <p className="mb-6 text-lg text-gray-600">
              ต้องการอนุมัติ{" "}
              <span className="font-semibold text-gray-800">
                {selectedUser?.FirstName} {selectedUser?.LastName}
              </span>
              ?
            </p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={handleApproveSave}
                className="px-6 py-2 bg-green-700 text-white rounded-full hover:bg-green-600 transition duration-200 ease-in-out"
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

export default ApproveUserRegistrations;
