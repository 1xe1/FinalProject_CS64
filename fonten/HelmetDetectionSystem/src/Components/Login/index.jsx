import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

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
      <div className="bg-white p-10 w-full max-w-md rounded-lg shadow-xl text-center">
        <h2 className="mb-6 text-2xl font-bold">ยินดีต้อนรับ</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="text"
              placeholder="รหัสนักศึกษา"
              value={studentID}
              onChange={(e) => setStudentID(e.target.value)}
              required
              className="w-full p-3 border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-colors"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-4/5 p-3 bg-gradient-to-r from-blue-600 to-pink-500 text-white font-semibold rounded-lg hover:bg-gradient-to-r hover:from-pink-500 hover:to-blue-600 transition-colors"
          >
            เข้าสู่ระบบ
          </button>
          <Link
            to="/Register"
            className="block mt-6 text-blue-600 hover:underline"
          >
            ลงทะเบียนเข้าสู่ระบบ
          </Link>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
