import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Register.css';

function Register() {
  const [studentInfo, setStudentInfo] = useState({
    studentID: '',
    username: '',
    password: '',
    confirmPassword: '',
    faculty: '',
    department: '',
    licensePlate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo({
      ...studentInfo,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log(studentInfo);
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>ลงทะเบียน</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="studentID"
              placeholder="รหัสนักศึกษา"
              value={studentInfo.studentID}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="ชื่อผู้ใช้"
              value={studentInfo.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="รหัสผ่าน"
              value={studentInfo.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="ยืนยันรหัสผ่าน"
              value={studentInfo.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="faculty"
              placeholder="คณะ"
              value={studentInfo.faculty}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="department"
              placeholder="สาขา"
              value={studentInfo.department}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="licensePlate"
              placeholder="หมายเลขทะเบียนรถ"
              value={studentInfo.licensePlate}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="register-button">สมัครสมาชิก</button>
          <Link to="/Login" className="login-link">เข้าสู่ระบบ</Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
