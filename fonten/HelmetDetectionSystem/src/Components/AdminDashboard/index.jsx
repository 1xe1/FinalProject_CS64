import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { saveAs } from "file-saver";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState({
    today: 0,
    thisMonth: 0,
    allTime: 0,
  });
  const [monthlyChartData, setMonthlyChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [detections, setDetections] = useState([]);
  const [filteredDetections, setFilteredDetections] = useState([]);
  const [filter, setFilter] = useState("allTime");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchStatistics();
    fetchDetections();
  }, [selectedDate]);

  const fetchStatistics = async () => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    try {
      const response = await fetch(
        `http://localhost:3000/api/statistics?date=${formattedDate}`
      );
      if (response.ok) {
        const data = await response.json();
        setStatistics({
          today: data.today,
          thisMonth: data.thisMonth,
          allTime: data.allTime,
        });
        setMonthlyChartData(data.monthlyData);
      } else {
        console.error("Failed to fetch statistics");
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const fetchDetections = async () => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/detections?date=${formattedDate}`
      );
      if (response.ok) {
        const data = await response.json();
        setDetections(data);
        setFilteredDetections(data); // Initialize filtered detections
      } else {
        console.error("Failed to fetch detections");
      }
    } catch (error) {
      console.error("Error fetching detections:", error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/export/without-helmet",
        {
          method: "GET",
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );
      if (response.ok) {
        const blob = await response.blob();
        saveAs(blob, "students_without_helmet.xlsx");
      } else {
        console.error("Failed to export data");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
    }
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
    } else {
      setFilteredDetections(detections);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="p-5 bg-gray-100 min-h-screen flex flex-col items-center">
        <h1 className="mb-5 text-4xl text-gray-800">สถิติทั้งหมด</h1>

        {/* Date Picker */}
        <div className="flex mb-5">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex justify-around w-full max-w-4xl mb-10">
          <button
            className={`bg-white p-5 rounded-lg shadow-lg text-center w-1/3 ${
              filter === "today" ? "border-2 border-blue-600" : ""
            }`}
            onClick={() => filterDetections("today")}
          >
            <h2 className="mb-2 text-2xl text-blue-600">วันนี้</h2>
            <p className="text-lg text-gray-700">จำนวน: {statistics.today}</p>
          </button>
          <button
            className={`bg-white p-5 rounded-lg shadow-lg text-center w-1/3 ${
              filter === "month" ? "border-2 border-blue-600" : ""
            }`}
            onClick={() => filterDetections("month")}
          >
            <h2 className="mb-2 text-2xl text-blue-600">เดือนนี้</h2>
            <p className="text-lg text-gray-700">
              จำนวน: {statistics.thisMonth}
            </p>
          </button>
          <button
            className={`bg-white p-5 rounded-lg shadow-lg text-center w-1/3 ${
              filter === "allTime" ? "border-2 border-blue-600" : ""
            }`}
            onClick={() => filterDetections("allTime")}
          >
            <h2 className="mb-2 text-2xl text-blue-600">ทั้งหมด</h2>
            <p className="text-lg text-gray-700">จำนวน: {statistics.allTime}</p>
          </button>
        </div>

        <div className="w-full max-w-4xl mb-10">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
          >
            ดาวน์โหลดข้อมูลนักศึกษาที่ไม่สวมหมวกกันน็อค
          </button>
        </div>

        <div className="w-full max-w-4xl mb-10">
          <h2 className="mb-5 text-2xl text-gray-800">กราฟสถิติการตรวจจับ</h2>
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <Line
              data={monthlyChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  tooltip: {
                    callbacks: {
                      label: function (tooltipItem) {
                        return `จำนวน: ${tooltipItem.raw}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
