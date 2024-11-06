import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import UserDashboard from "./Components/UserDashboard";
import Students from "./Components/Students";
import Login from "./Components/Login";
import Register from "./Components/Register";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./Components/PrivateRoute";
import AdminDashboard from "./Components/AdminDashboard";
import UserProfile from "./Components/UserProfile";
import Unauthorized from "./Components/Unauthorized";
import StudentDetails from "./Components/StudentDetails";
import ApproveUserRegistrations from "./Components/ApproveUserRegistrations";
import TeachersList from "./Components/TeachersList";
import AddTeacher from "./Components/AddTeacher";
import WarningPage from "./Components/WarningPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <>
      {!isAuthenticated ? (
        <Routes>
          <Route path="*" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      ) : (
        <div className="flex min-h-screen bg-gray-100">
          <Navbar />
          <div className="flex-1 p-5">
            <Routes>
              <Route
                path="/UserDashboard"
                element={<PrivateRoute element={<UserDashboard />} requiredRole="student" />}
              />
              <Route
                path="/Students"
                element={<PrivateRoute element={<Students />} requiredRole="teacher,admin" />}
              />
              <Route
                path="/UserProfile"
                element={<PrivateRoute element={<UserProfile />} />}
              />
              <Route
                path="/AdminDashboard"
                element={<PrivateRoute element={<AdminDashboard />} requiredRole="admin" />}
              />
              <Route
                path="/ApproveUserRegistrations"
                element={<PrivateRoute element={<ApproveUserRegistrations />} requiredRole="admin" />}
              />
              <Route
                path="/TeachersList"
                element={<PrivateRoute element={<TeachersList />} requiredRole="admin" />}
              />
              <Route
                path="/AddTeacher"
                element={<PrivateRoute element={<AddTeacher />} requiredRole="admin" />}
              />
              <Route
                path="/WarningPage"
                element={<PrivateRoute element={<WarningPage />} requiredRole="admin" />}
              />
              <Route path="/Register" element={<Register />} />
              <Route path="/Unauthorized" element={<Unauthorized />} />
              <Route path="/students/:studentId" element={<PrivateRoute element={<StudentDetails />} />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
