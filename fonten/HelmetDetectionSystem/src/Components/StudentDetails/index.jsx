import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const StudentDetails = () => {
  const { studentID } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/students/${studentID}`)
      .then((response) => response.json())
      .then((data) => setStudent(data));
  }, [studentID]);

  if (!student) {
    return <div>กำลังโหลด...</div>; // หรือแสดงข้อความโหลด
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">รายละเอียดนักศึกษา</h1>
      <p><strong>รหัสนักศึกษา:</strong> {student.StudentID}</p>
      <p><strong>ชื่อ:</strong> {student.FirstName}</p>
      <p><strong>นามสกุล:</strong> {student.LastName}</p>
      <p><strong>คณะ:</strong> {student.facultyName}</p>
      <p><strong>สาขาวิชา:</strong> {student.departmentName}</p>
      <p><strong>สถานะ:</strong> {student.StudentStatus}</p>
      {/* แสดงข้อมูลเพิ่มเติมได้ที่นี่ */}
    </div>
  );
};

export default StudentDetails;
