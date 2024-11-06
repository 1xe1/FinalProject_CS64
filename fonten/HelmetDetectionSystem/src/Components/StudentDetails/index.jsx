import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPen } from "react-icons/fa";
import DatePicker, { registerLocale } from "react-datepicker";
import th from "date-fns/locale/th";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaSave } from "react-icons/fa";

registerLocale("th", th);

const StudentDetails = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [stats, setStats] = useState({ today: 0, month: 0, allTime: 0 });
  const [detections, setDetections] = useState([]);
  const [filteredDetections, setFilteredDetections] = useState([]);
  const [filter, setFilter] = useState("allTime");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const [studentResponse, statsResponse, detectionsResponse] =
          await Promise.all([
            fetch(`http://localhost:3000/api/student/${studentId}`),
            fetch(`http://localhost:3000/api/student/${studentId}/statistics`),
            fetch(`http://localhost:3000/api/student/${studentId}/detections`),
          ]);

        if (studentResponse.ok && statsResponse.ok && detectionsResponse.ok) {
          const studentData = await studentResponse.json();
          const statsData = await statsResponse.json();
          const detectionsData = await detectionsResponse.json();

          setStudent(studentData.student);
          setStats(statsData);
          setDetections(detectionsData);
          setFilteredDetections(detectionsData);
          setNewStatus(studentData.student.StudentStatus);
        } else {
          setError("ไม่สามารถดึงข้อมูลนักศึกษาได้");
          toast.error("ไม่สามารถดึงข้อมูลนักศึกษาได้");
        }
      } catch (error) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูลนักศึกษา");
        toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลนักศึกษา");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

  const handleStatusChange = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setShowConfirmation(true);
  };

  const handleStatusSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/student/${studentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        setStudent({ ...student, StudentStatus: newStatus });
        setIsEditing(false);
        toast.success("ปรับปรุงสถานะสำเร็จ");
      } else {
        setError("ไม่สามารถปรับปรุงสถานะนักศึกษาได้");
        toast.error("ไม่สามารถปรับปรุงสถานะนักศึกษาได้");
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการปรับปรุงสถานะนักศึกษา");
      toast.error("เกิดข้อผิดพลาดในการปรับปรุงสถานะนักศึกษา");
    } finally {
      setShowConfirmation(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const filterDetections = (filterType) => {
    setFilter(filterType);
    const now = new Date();

    if (filterType === "today") {
      const filtered = detections.filter((detection) => {
        const detectionDate = new Date(detection.DetectionTime);
        return detectionDate.toDateString() === now.toDateString();
      });
      setFilteredDetections(filtered);
    } else if (filterType === "month") {
      const filtered = detections.filter((detection) => {
        const detectionDate = new Date(detection.DetectionTime);
        return (
          detectionDate.getMonth() === now.getMonth() &&
          detectionDate.getFullYear() === now.getFullYear()
        );
      });
      setFilteredDetections(filtered);
    } else if (filterType === "dateRange" && startDate && endDate) {
      const filtered = detections.filter((detection) => {
        const detectionDate = new Date(detection.DetectionTime);
        return (
          detectionDate >= new Date(startDate) &&
          detectionDate <= new Date(endDate)
        );
      });
      setFilteredDetections(filtered);
    } else {
      setFilteredDetections(detections);
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
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
      <div className="w-full flex mb-8">
        <button
          class="bg-white text-center w-36 rounded-2xl h-10 relative text-black text-lg font-semibold group"
          type="button"
          onClick={() => navigate(-1)}
        >
          <div class="bg-blue-600 rounded-xl h-8 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[136px] z-10 duration-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              height="20px"
              width="20px"
            >
              <path
                d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                fill="#000000"
              ></path>
              <path
                d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                fill="#000000"
              ></path>
            </svg>
          </div>
          <p class="translate-x-2">ย้อนกลับ</p>
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl p-8 mb-8">
        <h1 className="mb-8 text-4xl font-bold text-center text-gray-800">
          ชื่อ: {student.FirstName} {student.LastName}
        </h1>
        <div className="border-t border-gray-300 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <p className="text-gray-600 text-lg font-medium">รหัสนักศึกษา</p>
            <p className="text-gray-800 text-xl bg-gray-100 p-3 rounded-md">
              {student.StudentID}
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="text-gray-600 text-lg font-medium">สถานะ</p>
            {isEditing ? (
              <div className="flex space-x-2">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="text-gray-800 text-xl bg-gray-100 p-3 rounded-md w-full"
                >
                  <option value="กำลังศึกษา">กำลังศึกษา</option>
                  <option value="ออกจากการศึกษา">ออกจากการศึกษา</option>
                </select>
                <button
                  onClick={handleSaveClick}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                  <FaSave />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  ยกเลิก
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <p className="text-gray-800 text-xl bg-gray-100 p-3 rounded-md flex-1">
                  {student.StudentStatus}
                </p>
                <button
                  onClick={handleStatusChange}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  <FaPen />
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <p className="text-gray-600 text-lg font-medium">คณะ</p>
            <p className="text-gray-800 text-xl bg-gray-100 p-3 rounded-md">
              {student.FacultyName || "ไม่ระบุ"}
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="text-gray-600 text-lg font-medium">สาขาวิชา</p>
            <p className="text-gray-800 text-xl bg-gray-100 p-3 rounded-md">
              {student.DepartmentName || "ไม่ระบุ"}
            </p>
          </div>
          <div className="flex flex-col space-y-2 md:col-span-2">
            <p className="text-gray-600 text-lg font-medium">ทะเบียนรถ</p>
            <p className="text-gray-800 text-xl bg-gray-100 p-3 rounded-md">
              {student.LicensePlate || "ไม่ระบุ"}
            </p>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center w-80">
            <h2 className="text-2xl mb-4">ยืนยันการบันทึก</h2>
            <p className="mb-6">คุณแน่ใจหรือไม่ว่าต้องการบันทึกสถานะใหม่?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleStatusSave}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                ยืนยัน
              </button>
              <button
                onClick={handleCancelConfirmation}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="mb-5 text-4xl text-gray-800">
        สถิติการตรวจจับของนักศึกษา
      </h1>
      <div className="flex justify-around w-full max-w-4xl mb-10">
        <button
          className={`bg-white p-5 rounded-lg shadow-lg text-center w-1/3 ${
            filter === "today" ? "border-2 border-blue-600" : ""
          }`}
          onClick={() => filterDetections("today")}
        >
          <h2 className="mb-2 text-2xl text-blue-600">วันนี้</h2>
          <p className="text-lg text-gray-700">จำนวน: {stats.today}</p>
        </button>
        <button
          className={`bg-white p-5 rounded-lg shadow-lg text-center w-1/3 ${
            filter === "month" ? "border-2 border-blue-600" : ""
          }`}
          onClick={() => filterDetections("month")}
        >
          <h2 className="mb-2 text-2xl text-blue-600">เดือนนี้</h2>
          <p className="text-lg text-gray-700">จำนวน: {stats.month}</p>
        </button>
        <button
          className={`bg-white p-5 rounded-lg shadow-lg text-center w-1/3 ${
            filter === "allTime" ? "border-2 border-blue-600" : ""
          }`}
          onClick={() => filterDetections("allTime")}
        >
          <h2 className="mb-2 text-2xl text-blue-600">ทั้งหมด</h2>
          <p className="text-lg text-gray-700">จำนวน: {stats.allTime}</p>
        </button>
      </div>

      <div className="mb-10 text-center">
        <div className="flex items-center justify-center mb-4">
          <FaSearch className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-blue-600">กรองข้อมูลตามช่วงวันที่</span>
        </div>
        <div className="flex items-center justify-center">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            locale="th"
            dateFormat="dd/MM/yyyy"
            className="p-2 border rounded"
            placeholderText="เลือกวันที่เริ่มต้น"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            locale="th"
            dateFormat="dd/MM/yyyy"
            className="p-2 border rounded ml-2"
            placeholderText="เลือกวันที่สิ้นสุด"
          />
          <button
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center"
            onClick={() => filterDetections("dateRange")}
          >
            <FaSearch className="h-5 w-5 mr-1" />
            ค้นหา
          </button>
        </div>
      </div>

      <h2 className="mb-4 text-3xl text-gray-800">รายการการตรวจจับ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-4xl">
        {filteredDetections.length > 0 ? (
          filteredDetections.map((detection, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 relative group"
            >
              <img
                src={detection.ImageURL}
                alt="Helmet Detection"
                className="h-32 w-32 object-cover rounded-lg mb-3"
              />
              <p className="text-gray-700 text-center">
                เวลา: {formatDateTime(detection.DetectionTime)}
              </p>
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <img
                  src={detection.ImageURL}
                  alt="Full Image"
                  className="h-auto max-h-full w-auto max-w-full rounded-lg"
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            ยังไม่มีข้อมูลการตรวจจับ
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;
