import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const studentName = localStorage.getItem("studentName") || "Guest";
  const userRole = localStorage.getItem("userRole") || "Guest";

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleProfileClick = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    // Show logout modal popup
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentName");
    localStorage.removeItem("userRole");
    window.location.href = "/login"; // Redirect to login
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <nav className="navbar w-64 bg-[#111926] text-white p-5 relative">
      <div className="navbar-header mb-5">
        <p className="text-2xl mt-5">
          ระบบตรวจจับ
          <br />
          การสวมหมวกกันน็อค
        </p>
        <hr className="my-5" />
      </div>
      <ul className="navbar-menu list-none p-0 m-0">
        <li className="mb-5">
          <div className="text-sm">หน้าหลัก</div>
          {userRole === "student" && (
            <div className="pl-5">
              <Link
                to="/UserDashboard"
                className="flex items-center p-2 rounded hover:bg-[#1e2a38] transition-colors"
              >
                <Icon icon="mdi:home" className="text-2xl mr-2" />
                หน้าหลัก
              </Link>
            </div>
          )}
          {(userRole === "teacher" || userRole === "admin") && (
            <div className="pl-5">
              <Link
                to="/Students"
                className="flex items-center p-2 rounded hover:bg-[#1e2a38] transition-colors"
              >
                <Icon icon="ph:user-list" className="text-2xl mr-2" />
                ข้อมูลนักศึกษา
              </Link>
            </div>
          )}
          {userRole === "admin" && (
            <div className="pl-5">
  <Link
    to="/ManageUserRoles"
    className="flex items-center p-2 rounded hover:bg-[#1e2a38] transition-colors"
  >
    <Icon icon="mdi:account-cog" className="text-2xl mr-2" /> {/* เปลี่ยนไอคอนที่นี่ */}
    จัดการสิทธิ์
  </Link>
</div>

          )}
          {userRole === "admin" && (
            <div className="pl-5">
              <Link
                to="/AdminDashboard"
                className="flex items-center p-2 rounded hover:bg-[#1e2a38] transition-colors"
              >
                <Icon icon="uil:chart" className="text-2xl mr-2" />
                รายงานสรุปสถิติ
              </Link>
            </div>
          )}
        </li>
      </ul>
      <div className="navbar-profile absolute bottom-5 w-[calc(100%-2rem)]">
        <div className="relative">
          <button
            onClick={handleMenuToggle}
            className="flex items-center p-2 rounded hover:bg-[#1e2a38] transition-colors w-full"
            aria-expanded={menuOpen}
            aria-controls="profile-menu"
          >
            <Icon icon="mdi:account-circle" className="text-2xl mr-2" />
            {studentName}
          </button>
          {menuOpen && (
            <div
              id="profile-menu"
              className="absolute right-0 bottom-full mb-2 w-full bg-[#1e2a38] text-white border border-[#2c3e50] rounded shadow-lg"
            >
              <Link
                to="/UserProfile"
                className="block px-4 py-2 hover:bg-[#2c3e50] transition-colors"
                onClick={handleProfileClick}
              >
                ข้อมูลส่วนตัว
              </Link>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 w-full text-left hover:bg-[#2c3e50] transition-colors"
              >
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-full text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              คุณต้องการออกจากระบบ ?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                ออกจากระบบ
              </button>
              <button
                onClick={cancelLogout}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
