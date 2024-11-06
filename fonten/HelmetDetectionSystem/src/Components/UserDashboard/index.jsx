import React, { useEffect, useState } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import DatePicker, { registerLocale } from "react-datepicker";
import th from "date-fns/locale/th";
import "react-datepicker/dist/react-datepicker.css";

// Register Thai locale
registerLocale("th", th);

const UserDashboard = () => {
  const licensePlate = localStorage.getItem("licensePlate") || "None";
  const [stats, setStats] = useState({ today: 0, month: 0, allTime: 0 });
  const [detections, setDetections] = useState([]);
  const [filteredDetections, setFilteredDetections] = useState([]);
  const [filter, setFilter] = useState("allTime");
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      try {
        const [statsResponse, detectionsResponse] = await Promise.all([
          fetch("http://localhost:3000/api/user/statistics", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3000/api/user/detections", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (statsResponse.ok && detectionsResponse.ok) {
          const statsData = await statsResponse.json();
          const detectionsData = await detectionsResponse.json();
          setStats(statsData);
          setDetections(detectionsData);
          setFilteredDetections(detectionsData);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        return detectionDate >= startDate && detectionDate <= endDate;
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
    return <div className="p-5">Loading...</div>;
  }

  return (
    <div className="p-5 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-4xl text-gray-800 font-extrabold text-center mb-4">
          สถิติการตรวจจับ
        </h1>
        <p className="text-center text-xl text-gray-700 mb-4">
          เลขทะเบียน: {licensePlate}
        </p>
        <div className="h-1 w-24 bg-blue-500 mx-auto rounded"></div>
      </div>
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
      <div className="flex items-center mb-4">
        <FaSearch className="mr-2 text-blue-600" />
        <h2 className="text-xl text-blue-600">กรองข้อมูลตามช่วงวันที่</h2>
      </div>
      <div className="flex justify-center w-full max-w-4xl mb-10">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          locale="th"
          dateFormat="dd MMMM yyyy"
          placeholderText="เลือกวันที่เริ่มต้น"
          className="border p-2 rounded mx-2"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          locale="th"
          dateFormat="dd MMMM yyyy"
          placeholderText="เลือกวันที่สิ้นสุด"
          className="border p-2 rounded mx-2"
        />
        <button
          className="bg-blue-500 text-white p-2 rounded ml-4 flex items-center"
          onClick={() => filterDetections("dateRange")}
        >
          <FaSearch className="mr-2" />
          ค้นหา
        </button>
      </div>

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

export default UserDashboard;
