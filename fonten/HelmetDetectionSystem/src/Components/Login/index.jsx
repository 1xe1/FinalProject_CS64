import React from 'react';
import { Link } from 'react-router-dom'; // Import Link จาก react-router-dom
import './Login.css';

function Login() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>ยินดีต้อนรับ</h2>
        <form>
          <div className="input-group">
            <input type="text" placeholder="รหัสนักศึกษา" required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="รหัสผ่าน" required />
          </div>
          <button type="submit" className="login-button">เข้าสู่ระบบ</button>
          <Link to="/Register" className="register-link">ลงทะเบียนเข้าสู่ระบบ</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
