import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { saveAs } from 'file-saver'; // ใช้ file-saver เพื่อจัดการดาวน์โหลดไฟล์

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState({
    today: 0,
    thisMonth: 0,
    allTime: 0,
  });
  const [monthlyChartData, setMonthlyChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    // Fetch statistics from the server
    const fetchStatistics = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/statistics'); // Adjust the endpoint as needed
        if (response.ok) {
          const data = await response.json();
          setStatistics({
            today: data.today,
            thisMonth: data.thisMonth,
            allTime: data.allTime,
          });
          setMonthlyChartData(data.monthlyData); // Set chart data
        } else {
          console.error('Failed to fetch statistics');
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  // Function to handle export
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
        saveAs(blob, 'students_without_helmet.xlsx'); // Save the file with a specific name
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
          <div className="bg-white p-5 rounded-lg shadow-lg text-center w-1/3">
            <h2 className="mb-2 text-2xl text-blue-600">วันนี้</h2>
            <p className="text-lg text-gray-700">จำนวน: {statistics.today}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-lg text-center w-1/3">
            <h2 className="mb-2 text-2xl text-blue-600">เดือนนี้</h2>
            <p className="text-lg text-gray-700">จำนวน: {statistics.thisMonth}</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-lg text-center w-1/3">
            <h2 className="mb-2 text-2xl text-blue-600">ทั้งหมด</h2>
            <p className="text-lg text-gray-700">จำนวน: {statistics.allTime}</p>
          </div>
        </div>
        
        {/* ปุ่มสำหรับ Export ข้อมูล */}
        <div className="w-full max-w-4xl mb-10">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
          >
            ดาวน์โหลดข้อมูลนักศึกษาที่ไม่สวมหมวกกันน็อค
          </button>
        </div>

        <div className="w-full max-w-4xl mb-10">
          <h2 className="mb-5 text-2xl text-gray-800">กราฟสถิติการตรวจจับรายเดือน</h2>
          <div className="bg-white p-5 rounded-lg shadow-lg">
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
                      label: function(tooltipItem) {
                        return `จำนวน: ${tooltipItem.raw}`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
        <div className="w-full max-w-4xl mb-10">
          <h2 className="mb-5 text-2xl text-gray-800">กราฟการตรวจจับรายเดือน</h2>
          <div className="bg-white p-5 rounded-lg shadow-lg">
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
                      label: function(tooltipItem) {
                        return `จำนวน: ${tooltipItem.raw}`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
