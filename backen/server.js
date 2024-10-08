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

// Endpoint to get student data
app.get("/api/students", (req, res) => {
  const { facultyID, departmentID } = req.query;

  let query = "SELECT * FROM students WHERE UserRole = 'student'";
  let params = [];

  // Add additional conditions based on query parameters
  if (facultyID) {
    query += " AND FacultyID = ?";
    params.push(parseInt(facultyID));
  }

  if (departmentID) {
    query += " AND DepartmentID = ?";
    params.push(parseInt(departmentID));
  }

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

  const query = "SELECT * FROM students WHERE StudentID = ?";
  connection.query(query, [studentID], async (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid StudentID or Password" });
    }

    const student = results[0];

    // Compare the provided password with the stored hashed password
    const validPassword = await bcrypt.compare(password, student.PasswordHash);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid StudentID or Password" });
    }

    // Create a token with the student's ID and a 1-hour expiration time
    const token = jwt.sign({ id: student.StudentID }, secretKey, {
      expiresIn: "1h",
    });

    // Return the token and the student information
    res.json({ token, student });
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
      "INSERT INTO students (StudentID, FirstName, LastName, PasswordHash, FacultyID, DepartmentID, LicensePlate) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const params = [
      studentID,
      firstName,
      lastName,
      hashedPassword,
      faculty,
      department,
      licensePlate,
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
  // Replace these queries with your actual database queries to get the data
  const todayQuery =
    "SELECT COUNT(*) AS count FROM helmetdetection WHERE DATE(DetectionTime) = CURDATE()";
  const thisMonthQuery =
    "SELECT COUNT(*) AS count FROM helmetdetection WHERE MONTH(DetectionTime) = MONTH(CURDATE()) AND YEAR(DetectionTime) = YEAR(CURDATE())";
  const allTimeQuery = "SELECT COUNT(*) AS count FROM helmetdetection";
  const monthlyDataQuery = `
    SELECT MONTH(DetectionTime) AS month, COUNT(*) AS count
    FROM helmetdetection
    WHERE YEAR(DetectionTime) = YEAR(CURDATE())
    GROUP BY MONTH(DetectionTime)
    ORDER BY MONTH(DetectionTime)
  `;

  connection.query(todayQuery, (todayError, todayResults) => {
    if (todayError) {
      return res.status(500).json({ error: "Error fetching today's data" });
    }

    connection.query(thisMonthQuery, (thisMonthError, thisMonthResults) => {
      if (thisMonthError) {
        return res
          .status(500)
          .json({ error: "Error fetching this month's data" });
      }

      connection.query(allTimeQuery, (allTimeError, allTimeResults) => {
        if (allTimeError) {
          return res
            .status(500)
            .json({ error: "Error fetching all-time data" });
        }

        connection.query(
          monthlyDataQuery,
          (monthlyDataError, monthlyDataResults) => {
            if (monthlyDataError) {
              return res
                .status(500)
                .json({ error: "Error fetching monthly data" });
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
          }
        );
      });
    });
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

// Example backend code to update student status
app.put('/api/student/:id/status', (req, res) => {
  const studentId = req.params.id;
  const { status } = req.body;

  const query = 'UPDATE students SET StudentStatus = ? WHERE StudentID = ?';
  connection.query(query, [status, studentId], (error) => {
    if (error) {
      return res.status(500).json({ error: 'Error updating student status' });
    }
    res.json({ message: 'Status updated successfully' });
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
app.get("/api/Adminstudents", (req, res) => {
  const { facultyID, departmentID } = req.query;

  let query = "SELECT * FROM students";
  let params = [];

  // Add additional conditions based on query parameters
  if (facultyID || departmentID) {
    query += " WHERE";
    if (facultyID) {
      query += " FacultyID = ?";
      params.push(parseInt(facultyID));
    }
    if (departmentID) {
      if (params.length > 0) query += " AND";
      query += " DepartmentID = ?";
      params.push(parseInt(departmentID));
    }
  }

  connection.query(query, params, (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
    res.json(results);
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
