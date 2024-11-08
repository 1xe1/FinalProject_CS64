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

app.delete("/api/warning-images/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(IMAGE_DIRECTORY, filename);

    // ตรวจสอบว่าไฟล์มีอยู่จริง
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ 
        error: "File not found",
        details: "The specified image does not exist" 
      });
    }

    // ลบไฟล์
    fs.unlinkSync(filepath);
    console.log('Deleted image:', filename);
    
    res.json({ 
      message: "Image deleted successfully",
      filename: filename 
    });

  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ 
      error: "Could not delete image",
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
    SELECT s.StudentID, s.FirstName, s.LastName, s.StudentStatus, s.LicensePlate, h.DetectionTime, h.ImageURL
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
  const selectedDate = req.query.selectedDate || new Date().toISOString().slice(0, 10);
  const selectedMonth = new Date(selectedDate).getMonth() + 1;
  const selectedYear = req.query.selectedYear || new Date(selectedDate).getFullYear(); // รับค่าปีจาก query parameters

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
  WHERE YEAR(DetectionTime) = ?
`;
  
  const monthlyDataQuery = `
    SELECT MONTH(DetectionTime) AS month, COUNT(*) AS count
    FROM helmetdetection
    WHERE YEAR(DetectionTime) = ?
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

      connection.query(allTimeQuery, [selectedYear], (allTimeError, allTimeResults) => {
        if (allTimeError) {
          return res.status(500).json({ error: "Error fetching all-time data" });
        }

        connection.query(monthlyDataQuery, [selectedYear], (monthlyDataError, monthlyDataResults) => {
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
  const selectedDate = req.query.selectedDate || new Date().toISOString().slice(0, 10);
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
  const selectedMonth = req.query.selectedMonth || new Date().getMonth() + 1;
  const selectedYear = req.query.selectedYear || new Date().getFullYear();

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
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "กรุณาระบุวันที่เริ่มต้นและวันที่สิ้นสุด" });
    }

    // หาเดือนเริ่มต้นและเดือนสิ้นสุด
    const startMonth = new Date(startDate).getMonth() + 1;
    const endMonth = new Date(endDate).getMonth() + 1;
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();

    // สร้าง dynamic columns ตามช่วงเดือนที่เลือก
    let monthColumns = [];
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    // สร้าง columns ตามช่วงเดือนที่เลือก
    if (startYear === endYear) {
      for (let m = startMonth; m <= endMonth; m++) {
        monthColumns.push(`COALESCE(SUM(CASE WHEN md.detection_month = ${m} THEN md.count ELSE 0 END), 0) AS '${thaiMonths[m-1]}'`);
      }
    } else {
      // กรณีข้ามปี
      for (let m = startMonth; m <= 12; m++) {
        monthColumns.push(`COALESCE(SUM(CASE WHEN md.detection_month = ${m} THEN md.count ELSE 0 END), 0) AS '${thaiMonths[m-1]}'`);
      }
      for (let m = 1; m <= endMonth; m++) {
        monthColumns.push(`COALESCE(SUM(CASE WHEN md.detection_month = ${m} THEN md.count ELSE 0 END), 0) AS '${thaiMonths[m-1]}'`);
      }
    }

    const query = `
      WITH MonthlyDetections AS (
        SELECT 
          StudentID,
          MONTH(DetectionTime) as detection_month,
          COUNT(*) as count
        FROM 
          helmetdetection
        WHERE 
          DetectionTime BETWEEN ? AND ?
        GROUP BY 
          StudentID, MONTH(DetectionTime)
      )
      SELECT 
        s.StudentID AS 'รหัสนักศึกษา',
        s.FirstName AS 'ชื่อ',
        s.LastName AS 'นามสกุล',
        ${monthColumns.join(',\n        ')},
        COALESCE(SUM(md.count), 0) AS 'ทั้งหมด'
      FROM 
        students s
      LEFT JOIN 
        MonthlyDetections md ON s.StudentID = md.StudentID
      GROUP BY 
        s.StudentID, s.FirstName, s.LastName
      ORDER BY 
        s.StudentID;
    `;

    // ลดจำนวนพารามิเตอร์ลงเหลือแค่ 2 ตัว
    connection.query(query, [startDate, endDate], async (error, results) => {
      if (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
      }

      // สร้าง Excel file
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Student Data');

      // กำหนด headers และความกว้างคอลัมน์
      const headers = Object.keys(results[0]);
      worksheet.addRow(headers);

      // เพิ่มข้อมูล
      results.forEach(row => {
        worksheet.addRow(Object.values(row));
      });

      // จัดรูปแบบ
      worksheet.columns.forEach((column, index) => {
        if (index < 3) { // รหัสนักศึกษา, ชื่อ, นามสกุล
          column.width = 20;
        } else { // คอลัมน์เดือนและยอดรวม
          column.width = 15;
        }
        // จัดกึ่งกลางสำหรับตัวเลข
        if (index >= 3) {
          column.alignment = { horizontal: 'center' };
        }
      });

      // สร้าง buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // ส่งไฟล์กลับ
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=students_without_helmet.xlsx');
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
