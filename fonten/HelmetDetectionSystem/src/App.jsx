import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import UserDashboard from "./Components/UserDashboard";
import "./App.css";
import Students from "./Components/Students";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="content-container">
        <Routes>
        <Route path="/UserDashboard" element={<UserDashboard />} />
        <Route path="/Students" element={<Students />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
