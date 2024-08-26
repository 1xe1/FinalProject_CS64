import React from 'react';

const UserDashboard = () => {
  return (
    <div className="dashboard-container">
    <div className="p-5 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="mb-5 text-4xl text-gray-800">สถิติการตรวจจับ</h1>
      <div className="flex justify-around w-full max-w-4xl">
        <div className="bg-white p-5 rounded-lg shadow-lg text-center w-1/3">
          <h2 className="mb-2 text-2xl text-blue-600">วันนี้</h2>
          <p className="text-lg text-gray-700">จำนวน: 10</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg text-center w-1/3">
          <h2 className="mb-2 text-2xl text-blue-600">เดือนนี้</h2>
          <p className="text-lg text-gray-700">จำนวน: 50</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg text-center w-1/3">
          <h2 className="mb-2 text-2xl text-blue-600">ทั้งหมด</h2>
          <p className="text-lg text-gray-700">จำนวน: 200</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserDashboard;
