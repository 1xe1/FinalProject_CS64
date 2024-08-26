import React, { useState } from 'react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
};

const StudentDetailsModal = ({ studentDetails, onClose }) => {
  const [visibleDetections, setVisibleDetections] = useState(5); // Number of detections to show initially

  if (!studentDetails) return null;

  const loadMoreDetections = () => {
    setVisibleDetections(prev => prev + 5); // Load 5 more detections
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-800 opacity-60" onClick={onClose}></div>
      <div className="bg-white p-8 lg:p-16 rounded-lg shadow-lg z-10 max-w-6xl mx-auto relative flex flex-col lg:flex-row">
        <button 
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 focus:outline-none transition-colors duration-200" 
          onClick={onClose}
          aria-label="ปิด"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <div className="flex-1 lg:mr-8">
          <h2 className="text-2xl font-bold mb-8 text-center lg:text-left">รายละเอียดข้อมูลนักศึกษา</h2>

          <div className="mb-8">
            <p className="mb-2"><strong>รหัสนักศึกษา:</strong> {studentDetails.student.StudentID}</p>
            <p className="mb-2"><strong>ชื่อ:</strong> {studentDetails.student.FirstName}</p>
            <p className="mb-2"><strong>นามสกุล:</strong> {studentDetails.student.LastName}</p>
            <p className="mb-2"><strong>สถานะการศึกษา:</strong> {studentDetails.student.StudentStatus}</p>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <h3 className="text-lg font-semibold mb-4">ข้อมูลทะเบียนรถ</h3>
            <ul className="list-disc list-inside pl-4">
              {studentDetails.licensePlates.length > 0 ? (
                studentDetails.licensePlates.map(lp => (
                  <li key={lp.LicensePlateID} className="mb-2">ทะเบียนรถ: {lp.LicensePlate}</li>
                ))
              ) : (
                <li>ไม่มีข้อมูลทะเบียนรถ</li>
              )}
            </ul>
          </div>
        </div>

        <div className="lg:w-1/2 lg:pl-8 mt-8 lg:mt-0 flex-shrink-0">
          <div className="border-t border-gray-300 pt-4 lg:pt-0 h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">ข้อมูลการตรวจจับหมวกกันน็อก</h3>
            <ul className="list-disc list-inside pl-4">
              {studentDetails.helmetDetections.slice(0, visibleDetections).map(hd => (
                <li key={hd.DetectionID} className="mb-4">
                  <p>วันที่: {formatDate(hd.DetectionTime)}</p>
                  <p>เวลา: {formatTime(hd.DetectionTime)}</p>
                  <a href={hd.ImageURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    ดูภาพ
                  </a>
                </li>
              ))}
              {studentDetails.helmetDetections.length > visibleDetections && (
                <button 
                  onClick={loadMoreDetections} 
                  className="mt-4 text-blue-500 hover:underline focus:outline-none"
                >
                  ดูเพิ่มเติม
                </button>
              )}
            </ul>
            {studentDetails.helmetDetections.length === 0 && <p>ไม่มีข้อมูลการตรวจจับหมวกกันน็อก</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
