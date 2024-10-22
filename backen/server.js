const express = require("express");
const cors = require("cors");
const connection = require("./db"); // Import database connection
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken"); // Import jwt for token generation
const secretKey = "CRRU"; // Replace with a secure key
const XLSX = require("xlsx"); // Import xlsx package


const app = express();
const port = 3000;

// Use cors middleware
app.use(cors());

// Middleware for JSON body parsing
app.use(express.json());

// Endpoint to get student data filtered by teacherID and status
app.get("/api/students", (req, res) => {
  const { teacherID } = req.query;

  // Ensure that teacherID is provided
  if (!teacherID) {
    return res.status(400).json({ error: "Teacher ID is required" });
  }

  // Query to fetch students associated with the teacher and specific statuses
  const query = "SELECT * FROM students WHERE TeacherID = ? AND StudentStatus IN ('กำลังศึกษา', 'ออกจากการศึกษา')";
  const params = [teacherID];

  console.log("Executing query:", query, "with params:", params);

  connection.query(query, params, (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
    console.log("Query results:", results);
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
        return res.json({ token, userType: "student", userID: student.StudentID, user: student });
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
            return res.json({ token, userType: "admin", userID: admin.AdminID, user: admin });
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

// Endpoint to get statistics data based on the selected date
app.get("/api/statistics", (req, res) => {
  const selectedDate = req.query.date;

  // Ensure a date is provided
  if (!selectedDate) {
    return res.status(400).json({ error: "กรุณาระบุวันที่" });
  }

  // Queries adjusted to fetch data based on the selected date
  const dayQuery = `
    SELECT COUNT(*) AS count
    FROM helmetdetection
    WHERE DATE(DetectionTime) = ?`;
  
  const monthQuery = `
    SELECT COUNT(*) AS count
    FROM helmetdetection
    WHERE MONTH(DetectionTime) = MONTH(?) AND YEAR(DetectionTime) = YEAR(?)`;

  const yearQuery = `
    SELECT COUNT(*) AS count
    FROM helmetdetection
    WHERE YEAR(DetectionTime) = YEAR(?)`;

  const monthlyDataQuery = `
    SELECT MONTH(DetectionTime) AS month, COUNT(*) AS count
    FROM helmetdetection
    WHERE YEAR(DetectionTime) = YEAR(?)
    GROUP BY MONTH(DetectionTime)
    ORDER BY MONTH(DetectionTime)`;

  connection.query(dayQuery, [selectedDate], (dayError, dayResults) => {
    if (dayError) {
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลรายวัน" });
    }

    connection.query(monthQuery, [selectedDate, selectedDate], (monthError, monthResults) => {
      if (monthError) {
        return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลรายเดือน" });
      }

      connection.query(yearQuery, [selectedDate], (yearError, yearResults) => {
        if (yearError) {
          return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลรายปี" });
        }

        connection.query(monthlyDataQuery, [selectedDate], (monthlyDataError, monthlyDataResults) => {
          if (monthlyDataError) {
            return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลรายเดือน" });
          }

          // Prepare monthly data for the chart
          const months = [];
          const counts = [];
          monthlyDataResults.forEach((row) => {
            months.push(row.month);
            counts.push(row.count);
          });

          // Respond with the collected data
          res.json({
            today: dayResults[0].count,
            thisMonth: monthResults[0].count,
            allTime: yearResults[0].count,
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

// Endpoint to get student data
// app.get("/api/Adminstudents", (req, res) => {
//   const { facultyID, departmentID } = req.query;

//   let query = "SELECT * FROM students";
//   let params = [];

//   // Add additional conditions based on query parameters
//   if (facultyID || departmentID) {
//     query += " WHERE";
//     if (facultyID) {
//       query += " FacultyID = ?";
//       params.push(parseInt(facultyID));
//     }
//     if (departmentID) {
//       if (params.length > 0) query += " AND";
//       query += " DepartmentID = ?";
//       params.push(parseInt(departmentID));
//     }
//   }

//   connection.query(query, params, (error, results) => {
//     if (error) {
//       console.error("Database error:", error);
//       return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
//     }
//     res.json(results);
//   });
// });

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

// Endpoint to get students with a status of 'รอการอนุมัติ'
app.get("/api/pendingRegistrations", (req, res) => {
  // Query to fetch students with a status of 'รอการอนุมัติ'
  const query = "SELECT * FROM students WHERE StudentStatus = 'รอการอนุมัติ'";

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Error fetching pending registrations" });
    }

    res.json(results);
  });
});

// Endpoint to export student data without helmet
app.get("/api/export/without-helmet", (req, res) => {
  // Query to select students who were detected without a helmet
  const query = `
    SELECT s.StudentID, s.FirstName, s.LastName, s.LicensePlate, d.DetectionTime
    FROM students s
    JOIN helmetdetection d ON s.StudentID = d.StudentID
    WHERE d.ImageURL IS NOT NULL
    ORDER BY d.DetectionTime DESC
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(results);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "StudentsWithoutHelmet");

    // Write the workbook to a buffer
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Set the response headers to download the Excel file
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=students_without_helmet.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Send the Excel file as response
    res.send(excelBuffer);
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
