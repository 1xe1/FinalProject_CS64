import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-header">
        <p className="text-2xl mt-5">
          ระบบตรวจจับ
          <br />
          การสวมหมวกกันน็อค
        </p>
        <br />
        <hr />
        <br />
      </div>
      <ul className="navbar-menu">
        <li>
          <div className="text-sm">หน้าหลัก</div>
          <div className="pl-5">
            <Link to="/UserDashboard">
              <Icon icon="mdi:home" className="icon" />
              หน้าหลัก
            </Link>
          </div>
          <div className="pl-5">
            <Link to="/Students">
              <Icon icon="ph:user-list" className="icon" />
              ข้อมูลนักศึกษา
            </Link>
          </div>
          <div className="pl-5">
            <Link to="/UserDashboard">
              <Icon icon="uil:chart" className="icon" />
              รายงานสรุปสถิติ
            </Link>
          </div>
        </li>
      </ul>
      <div className="navbar-user">
        <Link to="/UserDashboard">
          <Icon icon="mdi:account-circle" className="icon" />
          ชื่อนักศึกษา
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
