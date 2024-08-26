const express = require('express');
const cors = require('cors');
const connection = require('./db'); // นำเข้าเชื่อมต่อฐานข้อมูล
const app = express();
const port = 3000;

// ใช้ cors middleware
app.use(cors());

// Middleware เพื่อจัดการ JSON body
app.use(express.json());

// Endpoint สำหรับดึงข้อมูลนักศึกษา
app.get('/api/students', (req, res) => {
  const { facultyID, departmentID } = req.query;

  let query = 'SELECT * FROM students WHERE 1=1';
  // let query = 'SELECT s.StudentID,s.FirstName,s.LastName,StudentStatus,f.FacultyID,f.FacultyName,d.DepartmentID,d.DepartmentName FROM students s join faculties f ON s.FacultyID = f.FacultyID join departments d ON s.DepartmentID = d.DepartmentID WHERE 1=1';
  let params = [];

  if (facultyID) {
    query += ' AND FacultyID = ?';
    params.push(parseInt(facultyID));
  }

  if (departmentID) {
    query += ' AND DepartmentID = ?';
    params.push(parseInt(departmentID));
  }

  console.log('Executing query:', query, 'with params:', params);

  connection.query(query, params, (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
    console.log('Query results:', results);
    res.json(results);
  });
});

// Endpoint สำหรับดึงข้อมูลนักศึกษาโดยละเอียด
app.get('/api/student/:id', (req, res) => {
  const studentID = parseInt(req.params.id);

  // ดึงข้อมูลนักศึกษา
  const studentQuery = 'SELECT * FROM students WHERE StudentID = ?';
  const studentParams = [studentID];

  // ดึงข้อมูลทะเบียนรถ
  const licensePlateQuery = 'SELECT * FROM licenseplates WHERE StudentID = ?';

  // ดึงข้อมูลการตรวจจับหมวกกันน็อก
  const helmetDetectionQuery = 'SELECT * FROM helmetdetection WHERE StudentID = ?';

  connection.query(studentQuery, studentParams, (studentError, studentResults) => {
    if (studentError) {
      console.error('Database error:', studentError);
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลนักศึกษา' });
    }

    if (studentResults.length === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลนักศึกษา' });
    }

    const studentData = studentResults[0];

    connection.query(licensePlateQuery, studentParams, (licensePlateError, licensePlateResults) => {
      if (licensePlateError) {
        console.error('Database error:', licensePlateError);
        return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลทะเบียนรถ' });
      }

      connection.query(helmetDetectionQuery, studentParams, (helmetDetectionError, helmetDetectionResults) => {
        if (helmetDetectionError) {
          console.error('Database error:', helmetDetectionError);
          return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการตรวจจับหมวกกันน็อก' });
        }

        res.json({
          student: studentData,
          licensePlates: licensePlateResults,
          helmetDetections: helmetDetectionResults,
        });
      });
    });
  });
});


// Endpoint สำหรับดึงข้อมูลคณะ
app.get('/api/faculties', (req, res) => {
  connection.query('SELECT * FROM faculties', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
    res.json(results);
  });
});

// Endpoint สำหรับดึงข้อมูลสาขาวิชา
app.get('/api/departments', (req, res) => {
  connection.query('SELECT * FROM departments', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
    res.json(results);
  });
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
