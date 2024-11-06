const express = require("express");
const cors = require("cors");
const connection = require("./db"); // Import database connection
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken"); // Import jwt for token generation
const secretKey = "CRRU"; // Replace with a secure key
const XLSX = require("xlsx"); // Import xlsx package
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const multer = require("multer");



const app = express();
const port = 3000;

// Use cors middleware
app.use(cors());

// Middleware for JSON body parsing
app.use(express.json());


const IMAGE_DIRECTORY = path.join(__dirname, "public/images");

// Endpoint เพื่อดึงชื่อไฟล์รูปภาพทั้งหมดใน directory
app.get("/api/warning-images", (req, res) => {
  try {
    // ตรวจสอบว่า directory มีอยู่จริง ถ้าไม่มีให้สร้างใหม่
    if (!fs.existsSync(IMAGE_DIRECTORY)) {
      fs.mkdirSync(IMAGE_DIRECTORY, { recursive: true });
      console.log('Created directory:', IMAGE_DIRECTORY);
    }

    // อ่านรายการไฟล์ทั้งหมดใน directory
    const files = fs.readdirSync(IMAGE_DIRECTORY);
    
    // กรองเฉพาะไฟล์ภาพที่ลงท้ายด้วย .jpg, .jpeg, หรือ .png
    const imageFiles = files.filter(file => 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.jpeg') || 
      file.toLowerCase().endsWith('.png')
    );

    // ส่งชื่อไฟล์รูปภาพออกมาเป็น array
    console.log('Found images:', imageFiles.length);
    res.json(imageFiles); // ส่งชื่อไฟล์ออกมาแทน URL

  } catch (error) {
    console.error("Error reading images:", error);
    res.status(500).json({ 
      error: "Could not retrieve images",
      details: error.message 
    });
  }
});


// Serve static files from the "public/images" folder
app.use("/images", express.static(path.join(__dirname, "public/images")));


// กำหนด storage สำหรับ multer เพื่อจัดการที่จัดเก็บไฟล์และตั้งชื่อไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGE_DIRECTORY); // บันทึกไฟล์ในโฟลเดอร์ public/images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // ตั้งชื่อไฟล์เป็น unique
  },
});

const upload = multer({ storage: storage });

// ตรวจสอบว่าโฟลเดอร์ IMAGE_DIRECTORY มีอยู่หรือไม่ ถ้าไม่มีก็สร้างใหม่
if (!fs.existsSync(IMAGE_DIRECTORY)) {
  fs.mkdirSync(IMAGE_DIRECTORY, { recursive: true });
  console.log("Created directory:", IMAGE_DIRECTORY);
}

// Endpoint สำหรับอัปโหลดรูปภาพ
app.post("/api/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({
    message: "Image uploaded successfully",
    filename: req.file.filename,
  });
});

// Endpoint to get student data with latest detection record by teacherID and status
app.get("/api/students", (req, res) => {
  const { teacherID } = req.query;

  if (!teacherID) {
    return res.status(400).json({ error: "Teacher ID is required" });
  }

  // SQL query to fetch students and their latest detection data
  const query = `
    SELECT s.StudentID, s.FirstName, s.LastName, s.StudentStatus, h.DetectionTime, h.ImageURL
    FROM students s
    LEFT JOIN (
      SELECT StudentID, MAX(DetectionTime) AS DetectionTime, ImageURL
      FROM helmetdetection
      GROUP BY StudentID
    ) h ON s.StudentID = h.StudentID
    WHERE s.TeacherID = ? AND s.StudentStatus IN ('กำลังศึกษา', 'ออกจากการศึกษา')
    ORDER BY h.DetectionTime DESC
  `;
  
  const params = [teacherID];
  
  connection.query(query, params, (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
    res.json(results);
  });
});


// Endpoint to get detailed student information
app.get("/api/student/:id", (req, res) => {
  const studentID = req.params.id;

  // const studentQuery = "SELECT * FROM students WHERE StudentID = ?";
  const studentQuery = `
  SELECT s.StudentID, s.FirstName, s.LastName,s.StudentStatus, s.FacultyID,s.DepartmentID,f.FacultyName, d.DepartmentName, s.LicensePlate
  FROM students s
  LEFT JOIN faculties f ON s.FacultyID = f.FacultyID
  LEFT JOIN departments d ON s.DepartmentID = d.DepartmentID
  WHERE s.StudentID = ?`;
  const studentParams = [studentID];

  const helmetDetectionQuery =
    "SELECT * FROM helmetdetection WHERE StudentID = ?";

  connection.query(
    studentQuery,
    studentParams,
    (studentError, studentResults) => {
      if (studentError) {
        console.error("Database error:", studentError);
        return res
          .status(500)
          .json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลนักศึกษา" });
      }

      if (studentResults.length === 0) {
        return res.status(404).json({ error: "ไม่พบข้อมูลนักศึกษา" });
      }

      const studentData = studentResults[0];

      connection.query(
        helmetDetectionQuery,
        studentParams,
        (helmetDetectionError, helmetDetectionResults) => {
          if (helmetDetectionError) {
            console.error("Database error:", helmetDetectionError);
            return res
              .status(500)
              .json({
                error: "เกิดข้อผิดพลาดในการดึงข้อมูลการตรวจจับหมวกกันน็อก",
              });
          }

          res.json({
            student: studentData,
            helmetDetections: helmetDetectionResults,
          });
        }
      );
    }
  );
});

// Endpoint to get faculty data
app.get("/api/faculties", (req, res) => {
  connection.query("SELECT * FROM faculties", (error, results) => {
    if (error) {
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
    res.json(results);
  });
});

// Endpoint to get department data
app.get("/api/departments", (req, res) => {
  connection.query("SELECT * FROM departments", (error, results) => {
    if (error) {
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
    res.json(results);
  });
});

// Login endpoint
app.post("/api/login", (req, res) => {
  const { studentID, password } = req.body;

  // Query to check if the student exists regardless of their status
  const studentQuery = "SELECT * FROM students WHERE StudentID = ?";
  const teacherQuery = "SELECT * FROM teachers WHERE TeacherID = ?";
  const adminQuery = "SELECT * FROM admins WHERE AdminID = ?";

  connection.query(studentQuery, [studentID], async (error, results) => {
    if (error) {
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในระบบฐานข้อมูล" });
    }

    if (results.length > 0) {
      const student = results[0];

      // Check if the student's status is not 'กำลังศึกษา' or 'ออกจากการศึกษา'
      if (student.StudentStatus === 'รอการอนุมัติ') {
        return res.status(403).json({ error: "บัญชีของคุณกำลังรอการอนุมัติ" });
      }

      if (student.StudentStatus !== 'กำลังศึกษา' && student.StudentStatus !== 'ออกจากการศึกษา') {
        return res.status(403).json({ error: `สถานะของคุณคือ ${student.StudentStatus}` });
      }

      // Validate the password
      const validPassword = await bcrypt.compare(password, student.PasswordHash);
      if (validPassword) {
        const token = jwt.sign({ id: student.StudentID, type: 'student' }, secretKey, { expiresIn: "1h" });
        return res.json({ 
          token, 
          userType: "student", 
          userID: student.StudentID, 
          user: student,
          licensePlate: student.LicensePlate
        });
      } else {
        return res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });
      }
    }

    // If no student matches, check for teacher credentials
    connection.query(teacherQuery, [studentID], async (error, results) => {
      if (error) {
        return res.status(500).json({ error: "เกิดข้อผิดพลาดในระบบฐานข้อมูล" });
      }

      if (results.length > 0) {
        const teacher = results[0];
        const validPassword = await bcrypt.compare(password, teacher.PasswordHash);
        if (validPassword) {
          const token = jwt.sign({ id: teacher.TeacherID, type: 'teacher' }, secretKey, { expiresIn: "1h" });
          return res.json({ token, userType: "teacher", userID: teacher.TeacherID, user: teacher });
        } else {
          return res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });
        }
      }

      // If no teacher matches, check for admin credentials
      connection.query(adminQuery, [studentID], async (error, results) => {
        if (error) {
          return res.status(500).json({ error: "เกิดข้อผิดพลาดในระบบฐานข้อมูล" });
        }

        if (results.length > 0) {
          const admin = results[0];
          const validPassword = await bcrypt.compare(password, admin.PasswordHash);
          if (validPassword) {
            const token = jwt.sign({ id: admin.AdminID, type: 'admin' }, secretKey, { expiresIn: "1h" });
            return res.json({ token, userType: "admin", userID: admin.AdminID, user: admin});
          } else {
            return res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });
          }
        }

        // If no match is found in any table
        return res.status(401).json({ error: "รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง" });
      });
    });
  });
});


// Register endpoint
app.post("/api/register", async (req, res) => {
  try {
    const {
      studentID,
      firstName,
      lastName,
      password,
      confirmPassword,
      faculty,
      department,
      licensePlate,
      teacherID, // Add the TeacherID field
    } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into the database
    const query =
      "INSERT INTO students (StudentID, FirstName, LastName, PasswordHash, FacultyID, DepartmentID, LicensePlate, TeacherID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const params = [
      studentID,
      firstName,
      lastName,
      hashedPassword,
      faculty,
      department,
      licensePlate,
      teacherID, // Add the TeacherID to the query
    ];

    connection.query(query, params, (error) => {
      if (error) {
        console.error("Error inserting student data:", error);
        return res
          .status(500)
          .json({ error: "เกิดข้อผิดพลาดในการลงทะเบียนนักศึกษา" });
      }

      // Registration successful
      res.status(201).json({ message: "ลงทะเบียนสำเร็จ" });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดที่ไม่คาดคิด" });
  }
});

// Add this endpoint to get user-specific statistics
app.get('/api/user/statistics', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    const studentID = decoded.id;

    // Example queries for statistics
    const todayQuery = 'SELECT COUNT(*) AS count FROM helmetdetection WHERE StudentID = ? AND DATE(DetectionTime) = CURDATE()';
    const monthQuery = 'SELECT COUNT(*) AS count FROM helmetdetection WHERE StudentID = ? AND YEAR(DetectionTime) = YEAR(CURDATE()) AND MONTH(DetectionTime) = MONTH(CURDATE())';
    const allTimeQuery = 'SELECT COUNT(*) AS count FROM helmetdetection WHERE StudentID = ?';

    connection.query(todayQuery, [studentID], (error, todayResults) => {
      if (error) return res.status(500).json({ error: 'Database error' });

      connection.query(monthQuery, [studentID], (error, monthResults) => {
        if (error) return res.status(500).json({ error: 'Database error' });

        connection.query(allTimeQuery, [studentID], (error, allTimeResults) => {
          if (error) return res.status(500).json({ error: 'Database error' });

          res.json({
            today: todayResults[0].count,
            month: monthResults[0].count,
            allTime: allTimeResults[0].count
          });
        });
      });
    });
  });
});


// Endpoint to get statistics data
app.get("/api/statistics", (req, res) => {
  // รับค่า selectedDate จาก query parameters หรือใช้วันที่ปัจจุบันเป็นค่าเริ่มต้น
  const selectedDate = req.query.selectedDate || new Date().toISOString().slice(0, 10);
  const selectedMonth = new Date(selectedDate).getMonth() + 1; // ดึงค่าเดือนจากวันที่ที่เลือก
  const selectedYear = new Date(selectedDate).getFullYear(); // ดึงค่าปีจากวันที่ที่เลือก

  const todayQuery = `
    SELECT COUNT(*) AS count 
    FROM helmetdetection 
    WHERE DATE(DetectionTime) = ?
  `;
  
  const thisMonthQuery = `
    SELECT COUNT(*) AS count 
    FROM helmetdetection 
    WHERE MONTH(DetectionTime) = ? AND YEAR(DetectionTime) = ?
  `;
  
  const allTimeQuery = `
    SELECT COUNT(*) AS count 
    FROM helmetdetection
  `;
  
  const monthlyDataQuery = `
    SELECT MONTH(DetectionTime) AS month, COUNT(*) AS count
    FROM helmetdetection
    WHERE YEAR(DetectionTime) = YEAR(CURDATE())
    GROUP BY MONTH(DetectionTime)
    ORDER BY MONTH(DetectionTime)
  `;

  connection.query(todayQuery, [selectedDate], (todayError, todayResults) => {
    if (todayError) {
      return res.status(500).json({ error: "Error fetching today's data" });
    }

    connection.query(thisMonthQuery, [selectedMonth, selectedYear], (thisMonthError, thisMonthResults) => {
      if (thisMonthError) {
        return res.status(500).json({ error: "Error fetching this month's data" });
      }

      connection.query(allTimeQuery, (allTimeError, allTimeResults) => {
        if (allTimeError) {
          return res.status(500).json({ error: "Error fetching all-time data" });
        }

        connection.query(monthlyDataQuery, (monthlyDataError, monthlyDataResults) => {
          if (monthlyDataError) {
            return res.status(500).json({ error: "Error fetching monthly data" });
          }

          const months = [];
          const counts = [];
          monthlyDataResults.forEach((row) => {
            months.push(row.month);
            counts.push(row.count);
          });

          res.json({
            today: todayResults[0].count,
            thisMonth: thisMonthResults[0].count,
            allTime: allTimeResults[0].count,
            monthlyData: {
              labels: months.map((month) => `เดือน ${month}`),
              datasets: [
                {
                  label: "จำนวนการตรวจจับรายเดือน",
                  data: counts,
                  borderColor: "rgba(75, 192, 192, 1)",
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderWidth: 1,
                },
              ],
            },
          });
        });
      });
    });
  });
});

app.get("/api/statistics/hourly", (req, res) => {
  const selectedDate = req.query.selectedDate || new Date().toISOString().slice(0, 10); // Default to today
  const hourlyQuery = `
    SELECT HOUR(DetectionTime) AS hour, COUNT(*) AS count
    FROM helmetdetection
    WHERE DATE(DetectionTime) = ?
    GROUP BY HOUR(DetectionTime)
    ORDER BY HOUR(DetectionTime)
  `;

  connection.query(hourlyQuery, [selectedDate], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error fetching hourly data" });
    }

    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const counts = Array(24).fill(0);

    results.forEach((row) => {
      counts[row.hour] = row.count;
    });

    res.json({
      labels: hours,
      counts: counts,
    });
  });
});

app.get("/api/statistics/daily", (req, res) => {
  const selectedMonth = req.query.selectedMonth || new Date().getMonth() + 1; // Default to current month
  const selectedYear = req.query.selectedYear || new Date().getFullYear(); // Default to current year

  const dailyQuery = `
    SELECT DAY(DetectionTime) AS day, COUNT(*) AS count
    FROM helmetdetection
    WHERE MONTH(DetectionTime) = ? AND YEAR(DetectionTime) = ?
    GROUP BY DAY(DetectionTime)
    ORDER BY DAY(DetectionTime)
  `;

  connection.query(dailyQuery, [selectedMonth, selectedYear], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error fetching daily data" });
    }

    const days = [];
    const counts = [];
    results.forEach((row) => {
      days.push(`วันที่ ${row.day}`);
      counts.push(row.count);
    });

    res.json({
      labels: days,
      counts: counts,
    });
  });
});


// Endpoint to get detection data for admin based on the selected date
app.get("/api/admin/detections", (req, res) => {
  const selectedDate = req.query.date;

  // Ensure a date is provided
  if (!selectedDate) {
    return res.status(400).json({ error: "กรุณาระบุวันที่" });
  }

  // Query to fetch detections based on the selected date
  const detectionsQuery = `
    SELECT *
    FROM helmetdetection
    WHERE DATE(DetectionTime) = ?`;

  connection.query(detectionsQuery, [selectedDate], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลการตรวจจับ" });
    }
    res.json(results);
  });
});


app.get('/api/user/detections', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    const studentID = decoded.id;

    const detectionsQuery = 'SELECT * FROM helmetdetection WHERE StudentID = ? ORDER BY DetectionTime DESC';
    
    connection.query(detectionsQuery, [studentID], (error, results) => {
      if (error) return res.status(500).json({ error: 'Database error' });

      res.json(results);
    });
  });
});

// Middleware for token verification
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.studentID = decoded.id;
    next();
  });
};

// Endpoint to get user profile data
app.get("/api/user/profile", verifyToken, (req, res) => {
  const query = `
    SELECT s.StudentID, s.FirstName, s.LastName, s.FacultyID,s.DepartmentID,f.FacultyName, d.DepartmentName, s.LicensePlate
    FROM students s
    LEFT JOIN faculties f ON s.FacultyID = f.FacultyID
    LEFT JOIN departments d ON s.DepartmentID = d.DepartmentID
    WHERE s.StudentID = ?`;

  connection.query(query, [req.studentID], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลผู้ใช้" });
    }
    res.json(results[0]);
  });
});

// Endpoint to update user profile data (except StudentID)
app.put("/api/user/profile", verifyToken, (req, res) => {
  const { firstName, lastName, facultyID, departmentID, licensePlate } = req.body;

  // ตรวจสอบว่าค่าต่างๆ ถูกส่งมาหรือไม่
  if (!firstName || !lastName || !facultyID || !departmentID || !licensePlate) {
    return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
  }

  const query = `
    UPDATE students 
    SET FirstName = ?, LastName = ?, FacultyID = ?, DepartmentID = ?, LicensePlate = ?
    WHERE StudentID = ?
  `;
  const params = [firstName, lastName, facultyID, departmentID, licensePlate, req.studentID];

  connection.query(query, params, (error, results) => {
    if (error) {
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล" });
    }
    res.json({ message: "แก้ไขข้อมูลสำเร็จ" });
  });
});

// Endpoint to get student-specific statistics
app.get('/api/student/:id/statistics', (req, res) => {
  const studentID = req.params.id;

  // Queries to fetch statistics for the specified student
  const todayQuery = 'SELECT COUNT(*) AS count FROM helmetdetection WHERE StudentID = ? AND DATE(DetectionTime) = CURDATE()';
  const monthQuery = 'SELECT COUNT(*) AS count FROM helmetdetection WHERE StudentID = ? AND YEAR(DetectionTime) = YEAR(CURDATE()) AND MONTH(DetectionTime) = MONTH(CURDATE())';
  const allTimeQuery = 'SELECT COUNT(*) AS count FROM helmetdetection WHERE StudentID = ?';

  connection.query(todayQuery, [studentID], (error, todayResults) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Error fetching today\'s statistics' });
    }

    connection.query(monthQuery, [studentID], (error, monthResults) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Error fetching this month\'s statistics' });
      }

      connection.query(allTimeQuery, [studentID], (error, allTimeResults) => {
        if (error) {
          console.error('Database error:', error);
          return res.status(500).json({ error: 'Error fetching all-time statistics' });
        }

        res.json({
          today: todayResults[0].count,
          month: monthResults[0].count,
          allTime: allTimeResults[0].count,
        });
      });
    });
  });
});


// Endpoint to get helmet detection data for a specific student
app.get('/api/student/:id/detections', (req, res) => {
  const studentID = req.params.id;

  const detectionsQuery = 'SELECT * FROM helmetdetection WHERE StudentID = ? ORDER BY DetectionTime DESC';

  connection.query(detectionsQuery, [studentID], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Error fetching helmet detection data' });
    }

    res.json(results);
  });
});

// Endpoint to update student status
app.put('/api/student/:id/status', (req, res) => {
  const studentId = req.params.id;
  const { status } = req.body;

  // Query to update the student status in the database
  const query = 'UPDATE students SET StudentStatus = ? WHERE StudentID = ?';
  connection.query(query, [status, studentId], (error) => {
    if (error) {
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการปรับปรุงสถานะนักศึกษา' });
    }
    res.json({ message: 'ปรับปรุงสถานะสำเร็จ' });
  });
});


// Endpoint to update a user's role
app.put("/api/users/:id/role", (req, res) => {
  const studentId = req.params.id;
  const { role } = req.body;

  // Validate the role
  if (!["student", "teacher", "admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role specified" });
  }

  const query = "UPDATE students SET UserRole = ? WHERE StudentID = ?";
  connection.query(query, [role, studentId], (error) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Error updating user role" });
    }
    // Send back the updated user role information
    res.json({ message: "User role updated successfully", StudentID: studentId, UserRole: role });
  });
});


// Endpoint to get all teachers
app.get("/api/teachers", (req, res) => {
  const { facultyID, departmentID } = req.query;

  let query = "SELECT * FROM teachers WHERE 1=1";
  let params = [];

  if (facultyID) {
    query += " AND FacultyID = ?";
    params.push(facultyID);
  }

  if (departmentID) {
    query += " AND DepartmentID = ?";
    params.push(departmentID);
  }

  connection.query(query, params, (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลอาจารย์" });
    }
    res.json(results);
  });
});

// Endpoint to approve a student by changing their status
app.put("/api/students/:studentID/approve", (req, res) => {
  const { studentID } = req.params;

  // Update the student's status to 'กำลังศึกษา'
  const query = "UPDATE students SET StudentStatus = 'กำลังศึกษา' WHERE StudentID = ? AND StudentStatus = 'รอการอนุมัติ'";
  
  connection.query(query, [studentID], (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Error updating student status" });
    }

    // Check if any row was affected
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found or already approved" });
    }

    res.json({ message: "Student status updated to 'กำลังศึกษา'" });
  });
});

// Endpoint to get students based on specific status
app.get("/api/pendingRegistrations", (req, res) => {
  const { status } = req.query; // รับค่า status จาก query parameters

  // คำสั่ง SQL พื้นฐาน
  let query = "SELECT * FROM students";
  const params = [];

  // ถ้ามีการระบุ status ให้เพิ่มเงื่อนไขการกรอง
  if (status) {
    query += " WHERE StudentStatus = ?";
    params.push(status);
  }

  connection.query(query, params, (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }

    res.json(results);
  });
});

// Endpoint to update a student's status
app.put("/api/students/:studentID/status", (req, res) => {
  const { studentID } = req.params;
  const { newStatus } = req.body; // Expecting newStatus in the request body

  const query = "UPDATE students SET StudentStatus = ? WHERE StudentID = ?";
  
  connection.query(query, [newStatus, studentID], (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Error updating student status" });
    }

    // Check if any row was affected
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: `Student status updated to '${newStatus}'` });
  });
});


// Endpoint to export student data without helmet
app.get("/api/export/custom-format", async (req, res) => {
  try {
    // Query to select all students, showing detections where available
    const query = `
      SELECT 
        s.StudentID AS 'รหัสนักศึกษา',
        s.FirstName AS 'ชื่อ',
        s.LastName AS 'นามสกุล',
        IFNULL(SUM(MONTH(d.DetectionTime) = 1), 0) AS 'มกราคม',
        IFNULL(SUM(MONTH(d.DetectionTime) = 2), 0) AS 'กุมภาพันธ์',
        IFNULL(SUM(MONTH(d.DetectionTime) = 3), 0) AS 'มีนาคม',
        IFNULL(SUM(MONTH(d.DetectionTime) = 4), 0) AS 'เมษายน',
        IFNULL(SUM(MONTH(d.DetectionTime) = 5), 0) AS 'พฤษภาคม',
        IFNULL(SUM(MONTH(d.DetectionTime) = 6), 0) AS 'มิถุนายน',
        IFNULL(SUM(MONTH(d.DetectionTime) = 7), 0) AS 'กรกฎาคม',
        IFNULL(SUM(MONTH(d.DetectionTime) = 8), 0) AS 'สิงหาคม',
        IFNULL(SUM(MONTH(d.DetectionTime) = 9), 0) AS 'กันยายน',
        IFNULL(SUM(MONTH(d.DetectionTime) = 10), 0) AS 'ตุลาคม',
        IFNULL(SUM(MONTH(d.DetectionTime) = 11), 0) AS 'พฤศจิกายน',
        IFNULL(SUM(MONTH(d.DetectionTime) = 12), 0) AS 'ธันวาคม',
        IFNULL(COUNT(d.DetectionID), 0) AS 'ทั้งหมด'
      FROM 
        students s
      LEFT JOIN 
        helmetdetection d ON s.StudentID = d.StudentID
      GROUP BY 
        s.StudentID, s.FirstName, s.LastName
      ORDER BY 
        s.StudentID;
    `;

    // Execute the query
    connection.query(query, async (error, results) => {
      if (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
      }

      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('StudentsWithoutHelmet');

      // Set column widths
      worksheet.columns = [
        { header: 'รหัสนักศึกษา', key: 'studentId', width: 15 },
        { header: 'ชื่อ', key: 'firstName', width: 20 },
        { header: 'นามสกุล', key: 'lastName', width: 20 },
        { header: 'มกราคม', key: 'jan', width: 15 },
        { header: 'กุมภาพันธ์', key: 'feb', width: 15 },
        { header: 'มีนาคม', key: 'mar', width: 15 },
        { header: 'เมษายน', key: 'apr', width: 15 },
        { header: 'พฤษภาคม', key: 'may', width: 15 },
        { header: 'มิถุนายน', key: 'jun', width: 15 },
        { header: 'กรกฎาคม', key: 'jul', width: 15 },
        { header: 'สิงหาคม', key: 'aug', width: 15 },
        { header: 'กันยายน', key: 'sep', width: 15 },
        { header: 'ตุลาคม', key: 'oct', width: 15 },
        { header: 'พฤศจิกายน', key: 'nov', width: 15 },
        { header: 'ธันวาคม', key: 'dec', width: 15 },
        { header: 'ทั้งหมด', key: 'total', width: 10 }
      ];

      // Merge the cells for the first row
      worksheet.mergeCells('A1:A2'); // รหัสนักศึกษา
      worksheet.mergeCells('B1:B2'); // ชื่อ
      worksheet.mergeCells('C1:C2'); // นามสกุล
      worksheet.mergeCells('D1:O1'); // Merge cells for the months' header
      worksheet.mergeCells('P1:P2'); // ทั้งหมด

      // Set the first row values
      worksheet.getCell('A1').value = 'รหัสนักศึกษา';
      worksheet.getCell('B1').value = 'ชื่อ';
      worksheet.getCell('C1').value = 'นามสกุล';
      worksheet.getCell('D1').value = 'เดือนที่ถูกตรวจจับไม่สวมหมวกกันน็อก';

      // Set the second row values for months
      const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
      months.forEach((month, index) => {
        worksheet.getCell(`${String.fromCharCode(68 + index)}2`).value = month; // D2 to P2
      });

      // Set styles for header rows
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber <= 2) {
          row.eachCell((cell) => {
            cell.font = { name: 'TH Sarabun New', bold: true, size: 16 };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });
        }
      });

      // Insert the data rows
      results.forEach((result, index) => {
        const row = worksheet.addRow({
          studentId: result['รหัสนักศึกษา'],
          firstName: result['ชื่อ'],
          lastName: result['นามสกุล'],
          jan: result['มกราคม'],
          feb: result['กุมภาพันธ์'],
          mar: result['มีนาคม'],
          apr: result['เมษายน'],
          may: result['พฤษภาคม'],
          jun: result['มิถุนายน'],
          jul: result['กรกฎาคม'],
          aug: result['สิงหาคม'],
          sep: result['กันยายน'],
          oct: result['ตุลาคม'],
          nov: result['พฤศจิกายน'],
          dec: result['ธันวาคม'],
          total: result['ทั้งหมด']
        });

        // Set font style for each cell in the data rows
        row.eachCell((cell) => {
          cell.font = { name: 'TH Sarabun New', size: 16 };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
      });

      // Generate a buffer for the workbook and send it as a response
      const buffer = await workbook.xlsx.writeBuffer();

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=students_without_helmet.xlsx"
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.send(buffer);
    });
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการสร้างไฟล์ Excel" });
  }
});


// Endpoint for getting all teachers, including FacultyID and DepartmentID
app.get("/api/Adminteachers", async (req, res) => {
  try {
    const query = `
      SELECT teachers.TeacherID, teachers.FirstName, teachers.LastName, teachers.Email,
             faculties.FacultyID, faculties.FacultyName AS Faculty, 
             departments.DepartmentID, departments.DepartmentName AS Department
      FROM teachers
      LEFT JOIN faculties ON teachers.FacultyID = faculties.FacultyID
      LEFT JOIN departments ON teachers.DepartmentID = departments.DepartmentID
    `;

    connection.query(query, (error, results) => {
      if (error) {
        console.error("Error fetching teachers data:", error);
        return res.status(500).json({ error: "ไม่สามารถดึงข้อมูลอาจารย์ได้" });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลอาจารย์" });
  }
});
// เพิ่มการตั้งค่าใน api/Adminteachers สำหรับ POST เพื่อเพิ่มข้อมูลอาจารย์ใหม่

app.post("/api/Adminteachers", async (req, res) => {
  const { TeacherID, FirstName, LastName, Email, Password, FacultyID, DepartmentID } = req.body;

  // Check that all necessary data is provided
  if (!TeacherID || !FirstName || !LastName || !Email || !Password || !FacultyID || !DepartmentID) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  try {
    // Encrypt the password before saving
    const hashedPassword = await bcrypt.hash(Password, 10);

    // SQL query to insert the teacher information
    const sql = `
      INSERT INTO teachers (TeacherID, FirstName, LastName, Email, PasswordHash, FacultyID, DepartmentID)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Execute the SQL query
    connection.query(
      sql,
      [TeacherID, FirstName, LastName, Email, hashedPassword, FacultyID, DepartmentID],
      (error, results) => {
        if (error) {
          console.error("Error inserting teacher:", error);
          return res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลอาจารย์" });
        }

        // Respond with the added teacher data
        res.status(201).json({
          TeacherID,
          FirstName,
          LastName,
          Email,
          FacultyID,
          DepartmentID,
        });
      }
    );
  } catch (error) {
    console.error("Error in adding teacher:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลอาจารย์" });
  }
});

// Update teacher information
app.put("/api/Adminteachers/:TeacherID", async (req, res) => {
  const { TeacherID } = req.params;
  const { FirstName, LastName, Email, FacultyID, DepartmentID } = req.body;

  // Ensure all required fields are provided
  if (!TeacherID || !FirstName || !LastName || !Email || !FacultyID || !DepartmentID) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  try {
    // SQL query to update the teacher's information, using FacultyID and DepartmentID directly
    const sql = `
      UPDATE teachers 
      SET 
        FirstName = ?, 
        LastName = ?, 
        Email = ?, 
        FacultyID = ?, 
        DepartmentID = ? 
      WHERE TeacherID = ?
    `;

    // Execute the SQL update query
    connection.query(
      sql,
      [FirstName, LastName, Email, FacultyID, DepartmentID, TeacherID],
      (error, results) => {
        if (error) {
          console.error("Error updating teacher:", error);
          return res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูลอาจารย์" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "ไม่พบอาจารย์ที่ระบุ" });
        }

        // Send the updated teacher information back in the response
        res.json({
          TeacherID,
          FirstName,
          LastName,
          Email,
          FacultyID,
          DepartmentID,
        });
      }
    );
  } catch (error) {
    console.error("Error in updating teacher:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูลอาจารย์" });
  }
});

// DELETE endpoint for removing a teacher by TeacherID
app.delete("/api/Adminteachers/:TeacherID", (req, res) => {
  const { TeacherID } = req.params;

  const sql = `DELETE FROM teachers WHERE TeacherID = ?`;
  
  connection.query(sql, [TeacherID], (error, results) => {
    if (error) {
      console.error("Error deleting teacher:", error);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูลอาจารย์" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "ไม่พบอาจารย์ที่ต้องการลบ" });
    }

    res.status(200).json({ message: "ลบข้อมูลอาจารย์สำเร็จ" });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
