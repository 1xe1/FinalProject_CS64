/*
 Navicat Premium Dump SQL

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 100427 (10.4.27-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : helmetaidata

 Target Server Type    : MySQL
 Target Server Version : 100427 (10.4.27-MariaDB)
 File Encoding         : 65001

 Date: 20/10/2024 16:20:26
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for departments
-- ----------------------------
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments`  (
  `DepartmentID` int NOT NULL COMMENT 'รหัสสาขาวิชา',
  `DepartmentName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'ชื่อสาขาวิชา',
  `FacultyID` int NULL DEFAULT NULL COMMENT 'รหัสคณะ (Foreign Key)',
  PRIMARY KEY (`DepartmentID`) USING BTREE,
  INDEX `FacultyID`(`FacultyID` ASC) USING BTREE,
  CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`FacultyID`) REFERENCES `faculties` (`FacultyID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = 'ตารางสำหรับจัดเก็บข้อมูลสาขาวิชา' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of departments
-- ----------------------------
INSERT INTO `departments` VALUES (1, 'วิศวกรรมคอมพิวเตอร์', 1);
INSERT INTO `departments` VALUES (2, 'วิศวกรรมเครื่องกล', 1);
INSERT INTO `departments` VALUES (3, 'การจัดการ', 2);
INSERT INTO `departments` VALUES (4, 'การตลาด', 2);
INSERT INTO `departments` VALUES (5, 'พัฒนาการเกษตร', 3);
INSERT INTO `departments` VALUES (6, 'สัตว์ศาสตร์', 3);
INSERT INTO `departments` VALUES (7, 'วิทยาการคอมพิวเตอร์', 4);
INSERT INTO `departments` VALUES (8, 'เทคโนโลยีสารสนเทศ', 4);

-- ----------------------------
-- Table structure for faculties
-- ----------------------------
DROP TABLE IF EXISTS `faculties`;
CREATE TABLE `faculties`  (
  `FacultyID` int NOT NULL COMMENT 'รหัสคณะ',
  `FacultyName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'ชื่อคณะ',
  PRIMARY KEY (`FacultyID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = 'ตารางสำหรับจัดเก็บข้อมูลคณะ' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of faculties
-- ----------------------------
INSERT INTO `faculties` VALUES (1, 'คณะวิศวกรรมศาสตร์');
INSERT INTO `faculties` VALUES (2, 'คณะบริหารธุรกิจ');
INSERT INTO `faculties` VALUES (3, 'คณะเกษตรศาสตร์');
INSERT INTO `faculties` VALUES (4, 'เทคโนโลยีคอมพิวเตอร์');

-- ----------------------------
-- Table structure for helmetdetection
-- ----------------------------
DROP TABLE IF EXISTS `helmetdetection`;
CREATE TABLE `helmetdetection`  (
  `DetectionID` int NOT NULL COMMENT 'รหัสการตรวจจับ (Primary Key)',
  `StudentID` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'รหัสนักศึกษา (Foreign Key)',
  `DetectionTime` datetime NOT NULL COMMENT 'เวลาการตรวจจับ',
  `ImageURL` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT 'ลิงค์หรือที่อยู่ของภาพการตรวจจับ',
  PRIMARY KEY (`DetectionID`) USING BTREE,
  INDEX `StudentID`(`StudentID` ASC) USING BTREE,
  CONSTRAINT `helmetdetection_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = 'ตารางสำหรับจัดเก็บข้อมูลการตรวจจับหมวกกันน็อก' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of helmetdetection
-- ----------------------------
INSERT INTO `helmetdetection` VALUES (1, 'S001', '2024-08-29 08:00:00', 'http://example.com/image1.jpg');
INSERT INTO `helmetdetection` VALUES (2, 'S001', '2024-08-29 08:30:00', 'http://example.com/image2.jpg');
INSERT INTO `helmetdetection` VALUES (3, 'S001', '2024-08-29 09:00:00', 'http://example.com/image3.jpg');
INSERT INTO `helmetdetection` VALUES (4, 'S002', '2024-08-29 09:00:00', 'http://example.com/image4.jpg');
INSERT INTO `helmetdetection` VALUES (5, 'S002', '2024-08-29 09:30:00', 'http://example.com/image5.jpg');
INSERT INTO `helmetdetection` VALUES (6, 'S002', '2024-08-29 10:00:00', 'http://example.com/image6.jpg');
INSERT INTO `helmetdetection` VALUES (7, 'S003', '2024-08-29 10:00:00', 'http://example.com/image7.jpg');
INSERT INTO `helmetdetection` VALUES (8, 'S003', '2024-08-29 10:30:00', 'http://example.com/image8.jpg');
INSERT INTO `helmetdetection` VALUES (9, 'S003', '2024-08-29 11:00:00', 'http://example.com/image9.jpg');
INSERT INTO `helmetdetection` VALUES (10, 'S003', '2024-08-29 11:30:00', 'http://example.com/image10.jpg');
INSERT INTO `helmetdetection` VALUES (11, 'S004', '2024-08-29 12:00:00', 'http://example.com/image11.jpg');
INSERT INTO `helmetdetection` VALUES (12, 'S004', '2024-08-29 12:30:00', 'http://example.com/image12.jpg');
INSERT INTO `helmetdetection` VALUES (13, 'S004', '2024-08-29 13:00:00', 'http://example.com/image13.jpg');
INSERT INTO `helmetdetection` VALUES (14, 'S005', '2024-08-29 13:30:00', 'http://example.com/image14.jpg');
INSERT INTO `helmetdetection` VALUES (15, 'S005', '2024-08-29 14:00:00', 'http://example.com/image15.jpg');
INSERT INTO `helmetdetection` VALUES (16, 'S005', '2024-08-29 14:30:00', 'http://example.com/image16.jpg');
INSERT INTO `helmetdetection` VALUES (17, 'S005', '2024-08-29 15:00:00', 'http://example.com/image17.jpg');
INSERT INTO `helmetdetection` VALUES (18, 'S006', '2024-08-29 15:30:00', 'http://example.com/image18.jpg');
INSERT INTO `helmetdetection` VALUES (19, 'S006', '2024-08-29 16:00:00', 'http://example.com/image19.jpg');
INSERT INTO `helmetdetection` VALUES (20, 'S006', '2024-08-29 16:30:00', 'http://example.com/image20.jpg');
INSERT INTO `helmetdetection` VALUES (21, '641463021', '2024-08-29 22:29:28', 'http://example.com/image20.jpg');
INSERT INTO `helmetdetection` VALUES (22, '641463021', '2024-07-24 22:38:30', 'http://example.com/image20.jpg');
INSERT INTO `helmetdetection` VALUES (23, '641463021', '2024-08-28 22:38:30', 'http://example.com/image20.jpg');
INSERT INTO `helmetdetection` VALUES (24, '641463021', '2024-08-29 22:29:28', 'http://example.com/image20.jpg');
INSERT INTO `helmetdetection` VALUES (25, '641463022', '2024-06-19 23:13:00', NULL);
INSERT INTO `helmetdetection` VALUES (26, '641463022', '2024-06-26 23:13:23', NULL);
INSERT INTO `helmetdetection` VALUES (27, '641463021', '2024-08-30 00:25:35', NULL);
INSERT INTO `helmetdetection` VALUES (28, '641463022', '2024-08-30 00:41:12', NULL);
INSERT INTO `helmetdetection` VALUES (81, 'S003', '2024-09-19 02:21:43', 'StudentWithoutHelmet/1725528928_licensePlate_3.png');
INSERT INTO `helmetdetection` VALUES (82, 'S001', '2024-09-19 02:21:43', 'StudentWithoutHelmet/2024-09-15_22-47-29_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (83, 'S001', '2024-09-19 02:21:43', 'StudentWithoutHelmet/Test10.png');
INSERT INTO `helmetdetection` VALUES (84, 'S002', '2024-09-19 02:21:43', 'StudentWithoutHelmet/Test2.jpg');
INSERT INTO `helmetdetection` VALUES (85, 'S003', '2024-09-18 21:29:41', NULL);
INSERT INTO `helmetdetection` VALUES (86, 'S010', '2024-09-18 21:30:17', NULL);
INSERT INTO `helmetdetection` VALUES (87, 'S003', '2024-09-19 02:46:51', '/licensePlateFound\\1725528928_licensePlate_3.png');
INSERT INTO `helmetdetection` VALUES (88, 'S001', '2024-09-19 02:46:51', '/licensePlateFound\\2024-09-15_22-47-29_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (89, 'S001', '2024-09-19 02:46:51', '/licensePlateFound\\Test10.png');
INSERT INTO `helmetdetection` VALUES (90, 'S002', '2024-09-19 02:46:51', '/licensePlateFound\\Test2.jpg');
INSERT INTO `helmetdetection` VALUES (91, 'S003', '2024-09-19 02:50:25', '/licensePlateFound\\1725528928_licensePlate_3.png');
INSERT INTO `helmetdetection` VALUES (92, 'S001', '2024-09-19 02:50:25', '/licensePlateFound\\2024-09-15_22-47-29_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (93, 'S001', '2024-09-19 02:50:25', '/licensePlateFound\\Test10.png');
INSERT INTO `helmetdetection` VALUES (94, 'S002', '2024-09-19 02:50:25', '/licensePlateFound\\Test2.jpg');
INSERT INTO `helmetdetection` VALUES (95, '641463020', '2024-09-19 22:17:13', '/licensePlateFound\\2024-09-19_22-16-04_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (96, '641463020', '2024-09-19 22:17:13', '/licensePlateFound\\2024-09-19_22-16-05_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (97, 'S001', '2024-09-19 22:17:13', '/licensePlateFound\\2024-09-19_22-16-23_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (98, 'S001', '2024-09-20 01:01:18', '/licensePlateFound\\2024-09-20_01-00-57_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (99, 'S001', '2024-09-20 01:01:18', '/licensePlateFound\\2024-09-20_01-00-58_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (100, 'S001', '2024-09-20 01:01:18', '/licensePlateFound\\2024-09-20_01-00-59_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (101, '641463020', '2024-09-20 01:06:26', '/licensePlateFound\\DSC_8230-1024x685 copy.jpg');
INSERT INTO `helmetdetection` VALUES (102, '641463020', '2024-09-20 01:10:29', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/DSC_8230-1024x685 copy 2.jpg');
INSERT INTO `helmetdetection` VALUES (103, 'S004', '2024-09-20 01:12:13', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_01-01-10_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (104, 'S004', '2024-09-20 01:12:13', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_01-01-11_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (105, 'S004', '2024-09-20 01:12:13', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_01-01-12_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (106, '641463020', '2024-09-20 01:12:13', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/DSC_8230-1024x685 copy.jpg');
INSERT INTO `helmetdetection` VALUES (107, '641463020', '2024-09-20 01:12:13', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/DSC_8230-1024x685.jpg');
INSERT INTO `helmetdetection` VALUES (108, 'S004', '2024-09-20 09:22:33', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_09-22-20_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (109, 'S004', '2024-09-20 09:22:33', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_09-22-21_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (110, 'S004', '2024-09-20 09:22:33', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_09-22-22_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (111, 'S004', '2024-09-20 09:23:38', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_09-22-23_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (112, 'S004', '2024-09-20 09:23:38', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_09-22-24_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (113, 'S004', '2024-09-20 09:23:38', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_09-22-26_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (114, 'S004', '2024-09-20 09:23:38', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_09-22-27_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (115, 'S004', '2024-09-20 09:23:38', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_09-23-28_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (116, 'S004', '2024-09-20 09:23:38', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_09-23-29_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (117, '641463020', '2024-09-21 19:40:04', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/DSC_8230-1024x685 copy.jpg');
INSERT INTO `helmetdetection` VALUES (118, 'S001', '2024-10-08 23:48:04', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-08_23-41-30_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (119, 'S001', '2024-10-08 23:48:04', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-08_23-41-31_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (120, 'S001', '2024-10-08 23:48:04', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-08_23-41-32_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (121, 'S004', '2024-10-08 23:48:04', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-08_23-41-42_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (122, 'S004', '2024-10-08 23:48:04', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-08_23-41-43_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (123, 'S004', '2024-10-08 23:48:04', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-08_23-41-44_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (124, 'S004', '2024-10-08 23:48:04', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-08_23-41-45_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (125, 'S005', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-00-58_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (126, 'S005', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-00-59_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (127, 'S005', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-00_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (128, 'S001', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-11_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (129, 'S001', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-12_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (130, 'S001', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-13_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (131, 'S001', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-14_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (132, 'S004', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-19_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (133, 'S004', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-20_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (134, 'S004', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-21_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (135, 'S004', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-22_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (136, 'S004', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-23_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (137, 'S005', '2024-10-09 00:17:59', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-00_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (138, 'S001', '2024-10-09 00:17:59', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-14_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (139, 'S004', '2024-10-09 00:17:59', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-23_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (140, 'S005', '2024-10-09 00:23:30', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-00_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (141, 'S001', '2024-10-09 00:23:30', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-14_WithoutHelmet_licensePlate.jpg');
INSERT INTO `helmetdetection` VALUES (142, 'S004', '2024-10-09 00:23:30', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-23_WithoutHelmet_licensePlate.jpg');

-- ----------------------------
-- Table structure for students
-- ----------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students`  (
  `StudentID` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'รหัสนักศึกษา',
  `FirstName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'ชื่อนักศึกษา',
  `LastName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'นามสกุลนักศึกษา',
  `FacultyID` int NULL DEFAULT NULL COMMENT 'รหัสคณะ (Foreign Key)',
  `DepartmentID` int NULL DEFAULT NULL COMMENT 'รหัสสาขาวิชา (Foreign Key)',
  `PasswordHash` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'รหัสผ่านที่เข้ารหัสแล้ว',
  `StudentStatus` enum('กำลังศึกษา','ออกจากการศึกษา') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'กำลังศึกษา' COMMENT 'สถานะการศึกษา',
  `LicensePlate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'หมายเลขทะเบียนรถ',
  `UserRole` enum('admin','teacher','student') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'student' COMMENT 'บทบาทของผู้ใช้งาน',
  PRIMARY KEY (`StudentID`) USING BTREE,
  INDEX `FacultyID`(`FacultyID` ASC) USING BTREE,
  INDEX `DepartmentID`(`DepartmentID` ASC) USING BTREE,
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`FacultyID`) REFERENCES `faculties` (`FacultyID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `students_ibfk_2` FOREIGN KEY (`DepartmentID`) REFERENCES `departments` (`DepartmentID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = 'ตารางสำหรับจัดเก็บข้อมูลนักศึกษา' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of students
-- ----------------------------
INSERT INTO `students` VALUES ('641463000', '641463000', '641463000', 1, 1, '$2a$10$BMFfWJZfK0IPD5LEFdeQ2eVPNjZlrDuP2ns5HtqqR37AHORqQKovu', 'กำลังศึกษา', 'asdfa', 'student');
INSERT INTO `students` VALUES ('641463020', 'อนุชิด', 'พาวง', 2, 3, '$2a$10$ZPpQezcp1JfpEF0pRam32.eNK2ITQKnOM1KncimD7g1iWSdegoeba', 'กำลังศึกษา', '0000', 'student');
INSERT INTO `students` VALUES ('641463021', 'anun', 'namwong', 1, 1, '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iW', 'กำลังศึกษา', 'กธ1669', 'teacher');
INSERT INTO `students` VALUES ('641463022', 'ทดสอบ', 'สอบทด', 1, 2, '$2b$10$Nd3nTqBoMLRbx6HWvo82FuH8yYrNgmt89Y2ic5/OPcgxstdR8L8jO', 'กำลังศึกษา', 'ฌม125', 'student');
INSERT INTO `students` VALUES ('641463023', 'ทดสอบ1', 'สอบทด1', 1, 2, '$2b$10$N1dx2/vdbeyCauN6SS96BelQ/w5HJCkZrgSw8mDcmZMwdX6ro9z0u', 'กำลังศึกษา', 'กรท45', 'student');
INSERT INTO `students` VALUES ('Admin', 'Admin', 'Admin', 1, 1, '$2a$10$vMB8xxCwO4d1CjPULyWj6u8SilKCkFVewPK5qAp59F3dE76qZFQbS', 'กำลังศึกษา', 'Admin', 'admin');
INSERT INTO `students` VALUES ('S001', 'สมชาย', 'ดี', 1, 2, '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iW', 'กำลังศึกษา', '1กษ7233', 'student');
INSERT INTO `students` VALUES ('S002', 'สมหญิง', 'ดี', 1, 2, '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iW', 'กำลังศึกษา', '6กผ40', 'student');
INSERT INTO `students` VALUES ('S003', 'สมศรี', 'ดี', 2, 3, '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iW', 'ออกจากการศึกษา', 'รวย55', 'student');
INSERT INTO `students` VALUES ('S004', 'สมเกียรติ', 'ดี', 2, 4, '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iW', 'กำลังศึกษา', '7กจ3572', 'student');
INSERT INTO `students` VALUES ('S005', 'สมพงษ์', 'ดี', 3, 6, '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iW', 'กำลังศึกษา', '5กร1995', 'student');
INSERT INTO `students` VALUES ('S006', 'สมปอง', 'ดี', 3, 5, '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iW', 'กำลังศึกษา', '6F6789', 'student');
INSERT INTO `students` VALUES ('S007', 'สมบัติ', 'ดี', 1, 1, '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iW', 'ออกจากการศึกษา', '7G7890', 'student');
INSERT INTO `students` VALUES ('S008', 'สมพร', 'ดี', 1, 2, '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iW', 'กำลังศึกษา', '8H8901', 'student');
INSERT INTO `students` VALUES ('S009', 'สมเพียร', 'ดี', 2, 4, '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iWa', 'กำลังศึกษา', '9I9012', 'student');
INSERT INTO `students` VALUES ('S010', 'สมอรรถ', 'ดี', 2, 3, 'hashedpassword10', 'กำลังศึกษา', '10J012', 'student');
INSERT INTO `students` VALUES ('Teacher01', 'Teacher01', 'Teacher01', 2, 4, '$2a$10$eSgGaDfYmsxCP9OkZCZn7ujIwh/.gshbnw/EaB2AqeFtfMw8vMoSa', 'กำลังศึกษา', 'Teacher01', 'teacher');
INSERT INTO `students` VALUES ('Teacher02', 'Teacher02', 'Teacher02', 2, 3, '$2a$10$eSgGaDfYmsxCP9OkZCZn7ujIwh/.gshbnw/EaB2AqeFtfMw8vMoSa', 'กำลังศึกษา', 'Teacher02', 'teacher');

SET FOREIGN_KEY_CHECKS = 1;
