import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const userName = localStorage.getItem("userName") || "Guest";
  const userType = localStorage.getItem("userType") || "Guest";

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
    localStorage.removeItem("userName");
    localStorage.removeItem("userType");
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
          {userType === "student" && (
            <div className="pl-5">
              <Link
                to="/UserDashboard"
                className="flex items-center p-2 rounded hover:bg-[#1e2a38] transition-colors"
              >
                <Icon icon="material-symbols:dashboard" className="text-2xl mr-2" />
                หน้าหลัก
              </Link>
            </div>
          )}
          {userType === "teacher" && (
            <div className="pl-5">
              <Link
                to="/Students"
                className="flex items-center p-2 rounded hover:bg-[#1e2a38] transition-colors"
              >
                <Icon icon="mdi:account-school" className="text-2xl mr-2" />
                ข้อมูลนักศึกษา
              </Link>
            </div>
          )}
          {userType === "admin" && (
            <div className="pl-5">
              <Link
                to="/ApproveUserRegistrations"
                className="flex items-center p-2 rounded hover:bg-[#1e2a38] transition-colors"
              >
                <Icon icon="mdi:account-check" className="text-2xl mr-2" />
                อนุมัติการสมัครสมาชิก
              </Link>
            </div>
          )}
          {userType === "admin" && (
            <div className="pl-5">
              <Link
                to="/TeachersList"
                className="flex items-center p-2 rounded hover:bg-[#1e2a38] transition-colors"
              >
                <Icon icon="mdi:teach" className="text-2xl mr-2" />
                อาจารย์
              </Link>
            </div>
          )}
          {userType === "admin" && (
            <div className="pl-5">
              <Link
                to="/WarningPage"
                className="flex items-center p-2 rounded hover:bg-[#1e2a38] transition-colors"
              >
                <Icon icon="material-symbols:warning-outline" className="text-2xl mr-2" />
                เฝ้าระวัง
              </Link>
            </div>
          )}
          {userType === "admin" && (
            <div className="pl-5">
              <Link
                to="/AdminDashboard"
                className="flex items-center p-2 rounded hover:bg-[#1e2a38] transition-colors"
              >
                <Icon icon="material-symbols:analytics-outline" className="text-2xl mr-2" />
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
            {userName}
          </button>
          {menuOpen && (
            <div
              id="profile-menu"
              className="absolute right-0 bottom-full mb-2 w-full bg-[#1e2a38] text-white border border-[#2c3e50] rounded shadow-lg"
            >
              {userType === "student" && (
                <Link
                  to="/UserProfile"
                  className="block px-4 py-2 hover:bg-[#2c3e50] transition-colors"
                  onClick={handleProfileClick}
                >
                  ข้อมูลส่วนตัว
                </Link>
              )}
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white/90 p-8 rounded-2xl shadow-2xl w-[400px] max-w-full text-center transform transition-all duration-300 scale-in-center border border-gray-100">
            <div className="mb-6 relative">
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-red-500/10 rounded-full p-4">
                <Icon 
                  icon="material-symbols:logout" 
                  className="text-6xl text-red-500 mx-auto animate-bounce"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800 mt-8">
              ออกจากระบบ
            </h2>
            <p className="text-gray-600 mb-8 text-sm">
              คุณต้องการที่จะออกจากระบบใช่หรือไม่? <br/>
              กรุณายืนยันการออกจากระบบอีกครั้ง
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl 
                hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium 
                flex items-center transform hover:scale-105 hover:shadow-lg"
              >
                <Icon icon="material-symbols:logout" className="mr-2 text-xl" />
                ออกจากระบบ
              </button>
              <button
                onClick={cancelLogout}
                className="bg-white text-gray-700 px-8 py-3 rounded-xl border border-gray-200
                hover:bg-gray-50 transition-all duration-300 font-medium
                transform hover:scale-105 hover:shadow-lg"
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
