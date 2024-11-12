import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPen } from "react-icons/fa";
import DatePicker, { registerLocale } from "react-datepicker";
import th from "date-fns/locale/th";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaSave } from "react-icons/fa";
import { IoSchool, IoCarSport } from "react-icons/io5";
import { FaUserGraduate, FaBuilding, FaBookReader } from "react-icons/fa";
import { MdClose } from "react-icons/md";

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
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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
    <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col items-center">
      <ToastContainer />
      
      <div className="w-full flex mb-8">
        <button
          onClick={() => navigate(-1)}
          className="group relative overflow-hidden px-8 py-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <span className="absolute inset-0 w-0 bg-blue-500 transition-all duration-300 ease-out group-hover:w-full"></span>
          <span className="relative flex items-center text-gray-700 group-hover:text-white transition-colors duration-300">
            <svg
              className="w-5 h-5 mr-2 transform group-hover:translate-x-[-4px] transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            ย้อนกลับ
          </span>
        </button>
      </div>

      <button
        onClick={() => setShowDetailsModal(true)}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 mb-8 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
      >
        <div className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full transform translate-x-16 -translate-y-16 opacity-50"></div>
          <h1 className="mb-4 text-4xl font-bold text-center text-gray-800">
            {student.FirstName} {student.LastName}
          </h1>
          <div className="flex items-center justify-center text-blue-600 group">
            <span className="mr-2">ดูข้อมูลนักศึกษา</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </button>

      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
             onClick={() => setShowDetailsModal(false)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl transform transition-all duration-300 scale-100 opacity-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative p-6 border-b">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full transform translate-x-20 -translate-y-20 opacity-50"></div>
              <div className="flex justify-between items-center relative">
                <h1 className="text-3xl font-bold text-gray-800">รายละเอียดนักศึกษา</h1>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <MdClose className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center mb-2">
                    <IoSchool className="w-6 h-6 text-blue-500 mr-2" />
                    <p className="text-gray-600 font-medium">รหัสนักศึกษา</p>
                  </div>
                  <p className="text-gray-800 text-xl">{student.StudentID}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center mb-2">
                    <FaUserGraduate className="w-6 h-6 text-blue-500 mr-2" />
                    <p className="text-gray-600 font-medium">สถานะ</p>
                  </div>
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="กำลังศึกษา">กำลังศึกษา</option>
                        <option value="ออกจากการศึกษา">ออกจากการศึกษา</option>
                      </select>
                      <button
                        onClick={handleSaveClick}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                      >
                        <FaSave className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                      >
                        <MdClose className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-800 text-xl">{student.StudentStatus}</p>
                      <button
                        onClick={handleStatusChange}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <FaPen className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center mb-2">
                    <FaBuilding className="w-6 h-6 text-blue-500 mr-2" />
                    <p className="text-gray-600 font-medium">คณะ</p>
                  </div>
                  <p className="text-gray-800 text-xl">{student.FacultyName || "ไม่ระบุ"}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center mb-2">
                    <FaBookReader className="w-6 h-6 text-blue-500 mr-2" />
                    <p className="text-gray-600 font-medium">สาขาวิชา</p>
                  </div>
                  <p className="text-gray-800 text-xl">{student.DepartmentName || "ไม่ระบุ"}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300 md:col-span-2">
                  <div className="flex items-center mb-2">
                    <IoCarSport className="w-6 h-6 text-blue-500 mr-2" />
                    <p className="text-gray-600 font-medium">ทะเบียนรถ</p>
                  </div>
                  <p className="text-gray-800 text-xl">{student.LicensePlate || "ไม่ระบุ"}</p>
                </div>
              </div>
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
          <h2 className="mb-2 text-2xl text-blue-600">
            วันที่ {new Date().getDate()}
          </h2>
          <p className="text-lg text-gray-700">จำนวน: {stats.today}</p>
        </button>
        <button
          className={`bg-white p-5 rounded-lg shadow-lg text-center w-1/3 ${
            filter === "month" ? "border-2 border-blue-600" : ""
          }`}
          onClick={() => filterDetections("month")}
        >
          <h2 className="mb-2 text-2xl text-blue-600">
            เดือน {new Date().toLocaleDateString('th-TH', { month: 'long' })}
          </h2>
          <p className="text-lg text-gray-700">จำนวน: {stats.month}</p>
        </button>
        <button
          className={`bg-white p-5 rounded-lg shadow-lg text-center w-1/3 ${
            filter === "allTime" ? "border-2 border-blue-600" : ""
          }`}
          onClick={() => filterDetections("allTime")}
        >
          <h2 className="mb-2 text-2xl text-blue-600">
            ปี {new Date().getFullYear() + 543}
          </h2>
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
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg z-10">
                {filteredDetections.length - index}
              </div>
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
