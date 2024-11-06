import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaUser, FaLock } from "react-icons/fa";

function Login() {
  const [studentID, setStudentID] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentID, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userID", data.userID);
        localStorage.setItem("userName", `${data.user.FirstName} ${data.user.LastName}`);
        localStorage.setItem("userType", data.userType);
        localStorage.setItem("licensePlate", data.licensePlate);
        
        toast.success("เข้าสู่ระบบสำเร็จ!");
        setTimeout(() => {
          if (data.userType === "student") {
            navigate("/UserDashboard");
          } else if (data.userType === "teacher") {
            navigate("/Students");
          } else if (data.userType === "admin") {
            navigate("/AdminDashboard");
          }
          window.location.reload();
        }, 2000);
      } else {
        // Display the error message from the server response
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("เกิดข้อผิดพลาดในระบบ");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-500 to-blue-700">
      <ToastContainer />

      <div className="bg-white/90 backdrop-blur-sm p-8 md:p-10 w-11/12 max-w-md rounded-2xl shadow-2xl text-center transform hover:scale-[1.02] transition-all duration-300">
        <h2 className="mb-8 text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-500 text-transparent bg-clip-text">ยินดีต้อนรับ</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="รหัสนักศึกษา"
              value={studentID}
              onChange={(e) => setStudentID(e.target.value)}
              required
              className="w-full p-4 pl-10 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none transition-all duration-300"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 pl-10 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none transition-all duration-300"
            />
          </div>
          <button
            type="submit"
            className="w-full p-4 bg-gradient-to-r from-blue-600 to-pink-500 text-white font-semibold rounded-lg hover:from-pink-500 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
          >
            เข้าสู่ระบบ
          </button>
          <Link
            to="/Register"
            className="block mt-6 text-blue-600 hover:text-pink-500 transition-colors duration-300 font-medium"
          >
            ลงทะเบียนเข้าสู่ระบบ
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
