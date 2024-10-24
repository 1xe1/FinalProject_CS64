import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2'; // Import Bar chart component
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { saveAs } from 'file-saver';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState({
    today: 0,
    thisMonth: 0,
    allTime: 0,
  });
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [monthlyChartData, setMonthlyChartData] = useState({
    labels: [],
    datasets: []
  });
  const [hourlyChartData, setHourlyChartData] = useState({
    labels: [],
    datasets: []
  });
  const [dailyChartData, setDailyChartData] = useState({
    labels: [],
    datasets: []
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchStatistics = async (date) => {
    try {
      const response = await fetch(`http://localhost:3000/api/statistics?selectedDate=${date}`);
      if (response.ok) {
        const data = await response.json();
        setStatistics({
          today: data.today,
          thisMonth: data.thisMonth,
          allTime: data.allTime,
        });
        setMonthlyChartData(data.monthlyData);
      } else {
        console.error('Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchHourlyData = async (date) => {
    try {
      const response = await fetch(`http://localhost:3000/api/statistics/hourly?selectedDate=${date}`);
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
        console.error('Failed to fetch hourly data');
      }
    } catch (error) {
      console.error('Error fetching hourly data:', error);
    }
  };

  const fetchDailyData = async (month, year) => {
    try {
      const response = await fetch(`http://localhost:3000/api/statistics/daily?selectedMonth=${month}&selectedYear=${year}`);
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
        console.error('Failed to fetch daily data');
      }
    } catch (error) {
      console.error('Error fetching daily data:', error);
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
    if (period === 'today') {
      fetchHourlyData(formattedDate);
    } else if (period === 'thisMonth') {
      fetchDailyData(selectedDate.getMonth() + 1, selectedDate.getFullYear());
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/export/without-helmet', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });
      if (response.ok) {
        const blob = await response.blob();
        saveAs(blob, 'students_without_helmet.xlsx');
      } else {
        console.error('Failed to export data');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="p-5 bg-gray-100 min-h-screen flex flex-col items-center">
        <h1 className="mb-5 text-4xl text-gray-800">สถิติทั้งหมด</h1>
        <div className="flex justify-around w-full max-w-4xl mb-10">
          <div
            className="bg-white p-5 rounded-lg shadow-lg text-center w-1/3 cursor-pointer transition duration-300 hover:bg-blue-100"
            onClick={() => handlePeriodClick('today')}
          >
            <h2 className="mb-2 text-2xl text-blue-600">วันนี้</h2>
            <p className="text-lg text-gray-700">จำนวน: {statistics.today}</p>
          </div>
          <div
            className="bg-white p-5 rounded-lg shadow-lg text-center w-1/3 cursor-pointer transition duration-300 hover:bg-blue-100"
            onClick={() => handlePeriodClick('thisMonth')}
          >
            <h2 className="mb-2 text-2xl text-blue-600">เดือนนี้</h2>
            <p className="text-lg text-gray-700">จำนวน: {statistics.thisMonth}</p>
          </div>
          <div
            className="bg-white p-5 rounded-lg shadow-lg text-center w-1/3 cursor-pointer transition duration-300 hover:bg-blue-100"
            onClick={() => handlePeriodClick('allTime')}
          >
            <h2 className="mb-2 text-2xl text-blue-600">ทั้งหมด</h2>
            <p className="text-lg text-gray-700">จำนวน: {statistics.allTime}</p>
          </div>
        </div>

        {/* Section for Date Picker and Export Button */}
        <div className="w-full max-w-4xl mb-10 flex justify-between items-center">
          {/* Date Picker for selecting a date */}
          <div className="flex-1">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              className="w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              calendarClassName="custom-datepicker"
            />
          </div>

          {/* Button for Exporting Data */}
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300 ml-4"
          >
            ดาวน์โหลดข้อมูลนักศึกษา
          </button>
        </div>

        <div className="w-full max-w-4xl mb-10">
          <h2 className="mb-5 text-2xl text-gray-800">
            {selectedPeriod === 'today' ? 'กราฟสถิติวันนี้ (รายชั่วโมง)' : selectedPeriod === 'thisMonth' ? 'กราฟสถิติรายวันของเดือนนี้' : 'กราฟสถิติการตรวจจับรายเดือน'}
          </h2>
          <div className="bg-white p-5 rounded-lg shadow-lg mb-10">
            {selectedPeriod === 'today' ? (
              <>
                <div className="mb-20">
                  <Line
                    data={hourlyChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
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
                <div className="mt-20">
                  <Bar
                    data={hourlyChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
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
              </>
            ) : selectedPeriod === 'thisMonth' ? (
              <>
                <div className="mb-20">
                  <Line
                    data={dailyChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
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
                <div className="mt-20">
                  <Bar
                    data={dailyChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
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
              </>
            ) : (
              <>
                <div className="mb-20">
                  <Line
                    data={monthlyChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
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
                <div className="mt-20">
                  <Bar
                    data={monthlyChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
