import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { saveAs } from "file-saver";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-custom.css";
import { FaDownload } from "react-icons/fa"; // Import download icon

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [monthlyChartData, setMonthlyChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [hourlyChartData, setHourlyChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [dailyChartData, setDailyChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportDateRange, setExportDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const fetchStatistics = async (date) => {
    try {
      setIsLoading(true); // Start loading
      const response = await fetch(
        `http://localhost:3000/api/statistics?selectedDate=${date}`
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
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const fetchHourlyData = async (date) => {
    try {
      setIsLoading(true); // Start loading
      const response = await fetch(
        `http://localhost:3000/api/statistics/hourly?selectedDate=${date}`
      );
      if (response.ok) {
        const data = await response.json();
        setHourlyChartData({
          labels: data.labels,
          datasets: [
            {
              label: "จำนวนการตรวจจับรายชั่วโมง",
              data: data.counts,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 1,
            },
          ],
        });
      } else {
        console.error("Failed to fetch hourly data");
      }
    } catch (error) {
      console.error("Error fetching hourly data:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const fetchDailyData = async (month, year) => {
    try {
      setIsLoading(true); // Start loading
      const response = await fetch(
        `http://localhost:3000/api/statistics/daily?selectedMonth=${month}&selectedYear=${year}`
      );
      if (response.ok) {
        const data = await response.json();
        setDailyChartData({
          labels: data.labels,
          datasets: [
            {
              label: "จำนวนการตรวจจับรายวัน",
              data: data.counts,
              borderColor: "rgba(153, 102, 255, 1)",
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              borderWidth: 1,
            },
          ],
        });
      } else {
        console.error("Failed to fetch daily data");
      }
    } catch (error) {
      console.error("Error fetching daily data:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    const formattedDate = selectedDate.toISOString().slice(0, 10);
    fetchStatistics(formattedDate);
    fetchHourlyData(formattedDate);
  }, [selectedDate]);

  const handlePeriodClick = (period) => {
    setSelectedPeriod(period);
    const formattedDate = selectedDate.toISOString().slice(0, 10);
    if (period === "today") {
      fetchHourlyData(formattedDate);
    } else if (period === "thisMonth") {
      fetchDailyData(selectedDate.getMonth() + 1, selectedDate.getFullYear());
    }
  };

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const startDate = exportDateRange.startDate.toISOString().slice(0, 10);
      const endDate = exportDateRange.endDate.toISOString().slice(0, 10);

      const response = await fetch(
        `http://localhost:3000/api/export/custom-format?startDate=${startDate}&endDate=${endDate}`,
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
        setIsModalOpen(false);
      } else {
        console.error("Failed to export data");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getThaiMonth = (month) => {
    const thaiMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    return thaiMonths[month];
  };

  const getThaiYear = (year) => {
    return year + 543;
  };

  return (
    <div className="dashboard-container">
      <div className="p-5 bg-gray-100 min-h-screen flex flex-col items-center">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
            สถิติทั้งหมด
          </h1>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            <span className="ml-4 text-lg text-gray-600">
              กำลังโหลดข้อมูล...
            </span>
          </div>
        ) : (
          <>
            <div className="flex justify-around w-full max-w-4xl mb-10">
              <div
                className="bg-white p-5 rounded-lg shadow-lg text-center w-1/3 cursor-pointer transition duration-300 hover:bg-blue-100"
                onClick={() => handlePeriodClick("today")}
              >
                <h2 className="mb-2 text-2xl text-blue-600">
                  วันที่ {selectedDate.getDate()}
                </h2>
                <p className="text-lg text-gray-700">
                  จำนวน: {statistics.today}
                </p>
              </div>
              <div
                className="bg-white p-5 rounded-lg shadow-lg text-center w-1/3 cursor-pointer transition duration-300 hover:bg-blue-100"
                onClick={() => handlePeriodClick("thisMonth")}
              >
                <h2 className="mb-2 text-2xl text-blue-600">
                  เดือน {getThaiMonth(selectedDate.getMonth())}
                </h2>
                <p className="text-lg text-gray-700">
                  จำนวน: {statistics.thisMonth}
                </p>
              </div>
              <div
                className="bg-white p-5 rounded-lg shadow-lg text-center w-1/3 cursor-pointer transition duration-300 hover:bg-blue-100"
                onClick={() => handlePeriodClick("allTime")}
              >
                <h2 className="mb-2 text-2xl text-blue-600">
                  ปี {getThaiYear(selectedDate.getFullYear())}
                </h2>
                <p className="text-lg text-gray-700">
                  จำนวน: {statistics.allTime}
                </p>
              </div>
            </div>

            <div className="w-full max-w-4xl mb-10 flex justify-between items-center">
              <div className="flex-1 mr-4">
                <div className="relative">
                  <label
                    htmlFor="datePicker"
                    className="block text-lg text-gray-700 mb-2"
                  >
                    เลือกวันที่:
                  </label>
                  <DatePicker
                    id="datePicker"
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm 
                              focus:outline-none focus:ring-2 focus:ring-blue-500 
                              transition duration-300 text-lg bg-white
                              hover:border-blue-400"
                    placeholderText="เลือกวันที่"
                  />
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-md flex items-center gap-2 hover:scale-105 transform transition duration-300 ease-in-out hover:bg-blue-600"
              >
                <FaDownload />
                <span>ดาวน์โหลดข้อมูลนักศึกษา</span>
              </button>
            </div>

            <div className="w-full max-w-4xl mb-10">
              <h2 className="mb-5 text-2xl text-gray-800">
                {selectedPeriod === "today"
                  ? "กราฟสถิติวันนี้ (รายชั่วโมง)"
                  : selectedPeriod === "thisMonth"
                  ? "กราฟสถิติรายวันของเดือนนี้"
                  : "กราฟสถิติการตรวจจับรายเดือน"}
              </h2>
              <div className="bg-white p-5 rounded-lg shadow-lg mb-10">
                {selectedPeriod === "today" ? (
                  <>
                    <Line
                      data={hourlyChartData}
                      options={{ responsive: true }}
                    />
                    <Bar
                      data={hourlyChartData}
                      options={{ responsive: true }}
                      className="mt-10"
                    />
                  </>
                ) : selectedPeriod === "thisMonth" ? (
                  <>
                    <Line
                      data={dailyChartData}
                      options={{ responsive: true }}
                    />
                    <Bar
                      data={dailyChartData}
                      options={{ responsive: true }}
                      className="mt-10"
                    />
                  </>
                ) : (
                  <>
                    <Line
                      data={monthlyChartData}
                      options={{ responsive: true }}
                    />
                    <Bar
                      data={monthlyChartData}
                      options={{ responsive: true }}
                      className="mt-10"
                    />
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Export Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">เลือกช่วงวันที่</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันที่เริ่มต้น
              </label>
              <DatePicker
                selected={exportDateRange.startDate}
                onChange={(date) =>
                  setExportDateRange((prev) => ({ ...prev, startDate: date }))
                }
                dateFormat="dd/MM/yyyy"
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันที่สิ้นสุด
              </label>
              <DatePicker
                selected={exportDateRange.endDate}
                onChange={(date) =>
                  setExportDateRange((prev) => ({ ...prev, endDate: date }))
                }
                dateFormat="dd/MM/yyyy"
                className="w-full p-2 border rounded"
                minDate={exportDateRange.startDate}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? "กำลังดาวน์โหลด..." : "ดาวน์โหลด"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
