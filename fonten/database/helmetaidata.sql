/*
 Navicat Premium Dump SQL

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 100432 (10.4.32-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : helmetaidata

 Target Server Type    : MySQL
 Target Server Version : 100432 (10.4.32-MariaDB)
 File Encoding         : 65001

 Date: 27/08/2024 03:03:34
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
INSERT INTO `departments` VALUES (3, 'เคมี', 2);
INSERT INTO `departments` VALUES (4, 'ฟิสิกส์', 2);
INSERT INTO `departments` VALUES (5, 'การเงิน', 3);
INSERT INTO `departments` VALUES (6, 'การตลาด', 3);

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
INSERT INTO `faculties` VALUES (1, 'วิศวกรรมศาสตร์');
INSERT INTO `faculties` VALUES (2, 'วิทยาศาสตร์');
INSERT INTO `faculties` VALUES (3, 'บริหารธุรกิจ');

-- ----------------------------
-- Table structure for helmetdetection
-- ----------------------------
DROP TABLE IF EXISTS `helmetdetection`;
CREATE TABLE `helmetdetection`  (
  `DetectionID` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสการตรวจจับ (Primary Key)',
  `StudentID` int NULL DEFAULT NULL COMMENT 'รหัสนักศึกษา (Foreign Key)',
  `LicensePlateID` int NULL DEFAULT NULL COMMENT 'รหัสทะเบียนรถ (Foreign Key)',
  `DetectionTime` datetime NOT NULL COMMENT 'เวลาการตรวจจับ',
  `ImageURL` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT 'ลิงค์หรือที่อยู่ของภาพการตรวจจับ',
  PRIMARY KEY (`DetectionID`) USING BTREE,
  INDEX `StudentID`(`StudentID` ASC) USING BTREE,
  INDEX `LicensePlateID`(`LicensePlateID` ASC) USING BTREE,
  CONSTRAINT `helmetdetection_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `helmetdetection_ibfk_2` FOREIGN KEY (`LicensePlateID`) REFERENCES `licenseplates` (`LicensePlateID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 81 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = 'ตารางสำหรับจัดเก็บข้อมูลการตรวจจับหมวกกันน็อก' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of helmetdetection
-- ----------------------------
INSERT INTO `helmetdetection` VALUES (1, 1, 1, '2024-08-01 08:00:00', 'https://example.com/images/detection1.jpg');
INSERT INTO `helmetdetection` VALUES (2, 2, 2, '2024-08-02 09:00:00', 'https://example.com/images/detection2.jpg');
INSERT INTO `helmetdetection` VALUES (3, 3, 3, '2024-08-03 10:00:00', 'https://example.com/images/detection3.jpg');
INSERT INTO `helmetdetection` VALUES (4, 4, 4, '2024-08-04 11:00:00', 'https://example.com/images/detection4.jpg');
INSERT INTO `helmetdetection` VALUES (5, 5, 5, '2024-08-05 12:00:00', 'https://example.com/images/detection5.jpg');
INSERT INTO `helmetdetection` VALUES (6, 6, 6, '2024-08-06 13:00:00', 'https://example.com/images/detection6.jpg');
INSERT INTO `helmetdetection` VALUES (7, 7, 7, '2024-08-07 14:00:00', 'https://example.com/images/detection7.jpg');
INSERT INTO `helmetdetection` VALUES (8, 8, 8, '2024-08-08 15:00:00', 'https://example.com/images/detection8.jpg');
INSERT INTO `helmetdetection` VALUES (9, 9, 9, '2024-08-09 16:00:00', 'https://example.com/images/detection9.jpg');
INSERT INTO `helmetdetection` VALUES (10, 10, 10, '2024-08-10 17:00:00', 'https://example.com/images/detection10.jpg');
INSERT INTO `helmetdetection` VALUES (11, 11, 1, '2024-08-21 08:00:00', 'https://example.com/images/detection11.jpg');
INSERT INTO `helmetdetection` VALUES (12, 12, 2, '2024-08-22 09:00:00', 'https://example.com/images/detection12.jpg');
INSERT INTO `helmetdetection` VALUES (13, 13, 3, '2024-08-23 10:00:00', 'https://example.com/images/detection13.jpg');
INSERT INTO `helmetdetection` VALUES (14, 14, 4, '2024-08-24 11:00:00', 'https://example.com/images/detection14.jpg');
INSERT INTO `helmetdetection` VALUES (15, 15, 5, '2024-08-25 12:00:00', 'https://example.com/images/detection15.jpg');
INSERT INTO `helmetdetection` VALUES (16, 16, 6, '2024-08-26 13:00:00', 'https://example.com/images/detection16.jpg');
INSERT INTO `helmetdetection` VALUES (17, 17, 7, '2024-08-27 14:00:00', 'https://example.com/images/detection17.jpg');
INSERT INTO `helmetdetection` VALUES (18, 18, 8, '2024-08-28 15:00:00', 'https://example.com/images/detection18.jpg');
INSERT INTO `helmetdetection` VALUES (19, 19, 9, '2024-08-29 16:00:00', 'https://example.com/images/detection19.jpg');
INSERT INTO `helmetdetection` VALUES (20, 20, 10, '2024-08-30 17:00:00', 'https://example.com/images/detection20.jpg');
INSERT INTO `helmetdetection` VALUES (21, 11, 1, '2024-08-21 08:00:00', 'https://example.com/images/detection11_1.jpg');
INSERT INTO `helmetdetection` VALUES (22, 11, 1, '2024-08-22 09:00:00', 'https://example.com/images/detection11_2.jpg');
INSERT INTO `helmetdetection` VALUES (23, 11, 1, '2024-08-23 10:00:00', 'https://example.com/images/detection11_3.jpg');
INSERT INTO `helmetdetection` VALUES (24, 11, 1, '2024-08-24 11:00:00', 'https://example.com/images/detection11_4.jpg');
INSERT INTO `helmetdetection` VALUES (25, 11, 1, '2024-08-25 12:00:00', 'https://example.com/images/detection11_5.jpg');
INSERT INTO `helmetdetection` VALUES (26, 11, 1, '2024-08-26 13:00:00', 'https://example.com/images/detection11_6.jpg');
INSERT INTO `helmetdetection` VALUES (27, 12, 2, '2024-08-21 08:30:00', 'https://example.com/images/detection12_1.jpg');
INSERT INTO `helmetdetection` VALUES (28, 12, 2, '2024-08-22 09:30:00', 'https://example.com/images/detection12_2.jpg');
INSERT INTO `helmetdetection` VALUES (29, 12, 2, '2024-08-23 10:30:00', 'https://example.com/images/detection12_3.jpg');
INSERT INTO `helmetdetection` VALUES (30, 12, 2, '2024-08-24 11:30:00', 'https://example.com/images/detection12_4.jpg');
INSERT INTO `helmetdetection` VALUES (31, 12, 2, '2024-08-25 12:30:00', 'https://example.com/images/detection12_5.jpg');
INSERT INTO `helmetdetection` VALUES (32, 12, 2, '2024-08-26 13:30:00', 'https://example.com/images/detection12_6.jpg');
INSERT INTO `helmetdetection` VALUES (33, 13, 3, '2024-08-21 14:00:00', 'https://example.com/images/detection13_1.jpg');
INSERT INTO `helmetdetection` VALUES (34, 13, 3, '2024-08-22 15:00:00', 'https://example.com/images/detection13_2.jpg');
INSERT INTO `helmetdetection` VALUES (35, 13, 3, '2024-08-23 16:00:00', 'https://example.com/images/detection13_3.jpg');
INSERT INTO `helmetdetection` VALUES (36, 13, 3, '2024-08-24 17:00:00', 'https://example.com/images/detection13_4.jpg');
INSERT INTO `helmetdetection` VALUES (37, 13, 3, '2024-08-25 18:00:00', 'https://example.com/images/detection13_5.jpg');
INSERT INTO `helmetdetection` VALUES (38, 13, 3, '2024-08-26 19:00:00', 'https://example.com/images/detection13_6.jpg');
INSERT INTO `helmetdetection` VALUES (39, 14, 4, '2024-08-21 08:15:00', 'https://example.com/images/detection14_1.jpg');
INSERT INTO `helmetdetection` VALUES (40, 14, 4, '2024-08-22 09:15:00', 'https://example.com/images/detection14_2.jpg');
INSERT INTO `helmetdetection` VALUES (41, 14, 4, '2024-08-23 10:15:00', 'https://example.com/images/detection14_3.jpg');
INSERT INTO `helmetdetection` VALUES (42, 14, 4, '2024-08-24 11:15:00', 'https://example.com/images/detection14_4.jpg');
INSERT INTO `helmetdetection` VALUES (43, 14, 4, '2024-08-25 12:15:00', 'https://example.com/images/detection14_5.jpg');
INSERT INTO `helmetdetection` VALUES (44, 14, 4, '2024-08-26 13:15:00', 'https://example.com/images/detection14_6.jpg');
INSERT INTO `helmetdetection` VALUES (45, 15, 5, '2024-08-21 14:30:00', 'https://example.com/images/detection15_1.jpg');
INSERT INTO `helmetdetection` VALUES (46, 15, 5, '2024-08-22 15:30:00', 'https://example.com/images/detection15_2.jpg');
INSERT INTO `helmetdetection` VALUES (47, 15, 5, '2024-08-23 16:30:00', 'https://example.com/images/detection15_3.jpg');
INSERT INTO `helmetdetection` VALUES (48, 15, 5, '2024-08-24 17:30:00', 'https://example.com/images/detection15_4.jpg');
INSERT INTO `helmetdetection` VALUES (49, 15, 5, '2024-08-25 18:30:00', 'https://example.com/images/detection15_5.jpg');
INSERT INTO `helmetdetection` VALUES (50, 15, 5, '2024-08-26 19:30:00', 'https://example.com/images/detection15_6.jpg');
INSERT INTO `helmetdetection` VALUES (51, 16, 6, '2024-08-21 08:45:00', 'https://example.com/images/detection16_1.jpg');
INSERT INTO `helmetdetection` VALUES (52, 16, 6, '2024-08-22 09:45:00', 'https://example.com/images/detection16_2.jpg');
INSERT INTO `helmetdetection` VALUES (53, 16, 6, '2024-08-23 10:45:00', 'https://example.com/images/detection16_3.jpg');
INSERT INTO `helmetdetection` VALUES (54, 16, 6, '2024-08-24 11:45:00', 'https://example.com/images/detection16_4.jpg');
INSERT INTO `helmetdetection` VALUES (55, 16, 6, '2024-08-25 12:45:00', 'https://example.com/images/detection16_5.jpg');
INSERT INTO `helmetdetection` VALUES (56, 16, 6, '2024-08-26 13:45:00', 'https://example.com/images/detection16_6.jpg');
INSERT INTO `helmetdetection` VALUES (57, 17, 7, '2024-08-21 09:00:00', 'https://example.com/images/detection17_1.jpg');
INSERT INTO `helmetdetection` VALUES (58, 17, 7, '2024-08-22 10:00:00', 'https://example.com/images/detection17_2.jpg');
INSERT INTO `helmetdetection` VALUES (59, 17, 7, '2024-08-23 11:00:00', 'https://example.com/images/detection17_3.jpg');
INSERT INTO `helmetdetection` VALUES (60, 17, 7, '2024-08-24 12:00:00', 'https://example.com/images/detection17_4.jpg');
INSERT INTO `helmetdetection` VALUES (61, 17, 7, '2024-08-25 13:00:00', 'https://example.com/images/detection17_5.jpg');
INSERT INTO `helmetdetection` VALUES (62, 17, 7, '2024-08-26 14:00:00', 'https://example.com/images/detection17_6.jpg');
INSERT INTO `helmetdetection` VALUES (63, 18, 8, '2024-08-21 09:15:00', 'https://example.com/images/detection18_1.jpg');
INSERT INTO `helmetdetection` VALUES (64, 18, 8, '2024-08-22 10:15:00', 'https://example.com/images/detection18_2.jpg');
INSERT INTO `helmetdetection` VALUES (65, 18, 8, '2024-08-23 11:15:00', 'https://example.com/images/detection18_3.jpg');
INSERT INTO `helmetdetection` VALUES (66, 18, 8, '2024-08-24 12:15:00', 'https://example.com/images/detection18_4.jpg');
INSERT INTO `helmetdetection` VALUES (67, 18, 8, '2024-08-25 13:15:00', 'https://example.com/images/detection18_5.jpg');
INSERT INTO `helmetdetection` VALUES (68, 18, 8, '2024-08-26 14:15:00', 'https://example.com/images/detection18_6.jpg');
INSERT INTO `helmetdetection` VALUES (69, 19, 9, '2024-08-21 10:00:00', 'https://example.com/images/detection19_1.jpg');
INSERT INTO `helmetdetection` VALUES (70, 19, 9, '2024-08-22 11:00:00', 'https://example.com/images/detection19_2.jpg');
INSERT INTO `helmetdetection` VALUES (71, 19, 9, '2024-08-23 12:00:00', 'https://example.com/images/detection19_3.jpg');
INSERT INTO `helmetdetection` VALUES (72, 19, 9, '2024-08-24 13:00:00', 'https://example.com/images/detection19_4.jpg');
INSERT INTO `helmetdetection` VALUES (73, 19, 9, '2024-08-25 14:00:00', 'https://example.com/images/detection19_5.jpg');
INSERT INTO `helmetdetection` VALUES (74, 19, 9, '2024-08-26 15:00:00', 'https://example.com/images/detection19_6.jpg');
INSERT INTO `helmetdetection` VALUES (75, 20, 10, '2024-08-21 11:00:00', 'https://example.com/images/detection20_1.jpg');
INSERT INTO `helmetdetection` VALUES (76, 20, 10, '2024-08-22 12:00:00', 'https://example.com/images/detection20_2.jpg');
INSERT INTO `helmetdetection` VALUES (77, 20, 10, '2024-08-23 13:00:00', 'https://example.com/images/detection20_3.jpg');
INSERT INTO `helmetdetection` VALUES (78, 20, 10, '2024-08-24 14:00:00', 'https://example.com/images/detection20_4.jpg');
INSERT INTO `helmetdetection` VALUES (79, 20, 10, '2024-08-25 15:00:00', 'https://example.com/images/detection20_5.jpg');
INSERT INTO `helmetdetection` VALUES (80, 20, 10, '2024-08-26 16:00:00', 'https://example.com/images/detection20_6.jpg');

-- ----------------------------
-- Table structure for licenseplates
-- ----------------------------
DROP TABLE IF EXISTS `licenseplates`;
CREATE TABLE `licenseplates`  (
  `LicensePlateID` int NOT NULL AUTO_INCREMENT COMMENT 'รหัสทะเบียนรถ (Primary Key)',
  `LicensePlate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'หมายเลขทะเบียนรถ',
  `StudentID` int NULL DEFAULT NULL COMMENT 'รหัสนักศึกษา (Foreign Key)',
  PRIMARY KEY (`LicensePlateID`) USING BTREE,
  INDEX `StudentID`(`StudentID` ASC) USING BTREE,
  CONSTRAINT `licenseplates_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = 'ตารางสำหรับจัดเก็บข้อมูลหมายเลขทะเบียนรถ' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of licenseplates
-- ----------------------------
INSERT INTO `licenseplates` VALUES (1, 'กข 1234', 1);
INSERT INTO `licenseplates` VALUES (2, 'ขค 2345', 2);
INSERT INTO `licenseplates` VALUES (3, 'คง 3456', 3);
INSERT INTO `licenseplates` VALUES (4, 'งจ 4567', 4);
INSERT INTO `licenseplates` VALUES (5, 'จฉ 5678', 5);
INSERT INTO `licenseplates` VALUES (6, 'ฉช 6789', 6);
INSERT INTO `licenseplates` VALUES (7, 'ชฌ 7890', 7);
INSERT INTO `licenseplates` VALUES (8, 'ซญ 8901', 8);
INSERT INTO `licenseplates` VALUES (9, 'ญฎ 9012', 9);
INSERT INTO `licenseplates` VALUES (10, 'ฎฐ 0123', 10);
INSERT INTO `licenseplates` VALUES (11, 'กบ 1234', 11);
INSERT INTO `licenseplates` VALUES (12, 'ขน 5678', 12);
INSERT INTO `licenseplates` VALUES (13, 'คท 9012', 13);
INSERT INTO `licenseplates` VALUES (14, 'งจ 3456', 14);
INSERT INTO `licenseplates` VALUES (15, 'จฉ 7890', 15);
INSERT INTO `licenseplates` VALUES (16, 'ฉท 8901', 16);
INSERT INTO `licenseplates` VALUES (17, 'ชญ 9012', 17);
INSERT INTO `licenseplates` VALUES (18, 'ซง 1234', 18);
INSERT INTO `licenseplates` VALUES (19, 'ญฏ 5678', 19);
INSERT INTO `licenseplates` VALUES (20, 'ฎฐ 9012', 20);

-- ----------------------------
-- Table structure for students
-- ----------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students`  (
  `StudentID` int NOT NULL COMMENT 'รหัสนักศึกษา',
  `FirstName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'ชื่อนักศึกษา',
  `LastName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'นามสกุลนักศึกษา',
  `FacultyID` int NULL DEFAULT NULL COMMENT 'รหัสคณะ (Foreign Key)',
  `DepartmentID` int NULL DEFAULT NULL COMMENT 'รหัสสาขาวิชา (Foreign Key)',
  `PasswordHash` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'รหัสผ่านที่เข้ารหัสแล้ว',
  `StudentStatus` enum('กำลังศึกษา','ออกจากการศึกษา') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'กำลังศึกษา' COMMENT 'สถานะการศึกษา',
  PRIMARY KEY (`StudentID`) USING BTREE,
  INDEX `FacultyID`(`FacultyID` ASC) USING BTREE,
  INDEX `DepartmentID`(`DepartmentID` ASC) USING BTREE,
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`FacultyID`) REFERENCES `faculties` (`FacultyID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `students_ibfk_2` FOREIGN KEY (`DepartmentID`) REFERENCES `departments` (`DepartmentID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = 'ตารางสำหรับจัดเก็บข้อมูลนักศึกษา' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of students
-- ----------------------------
INSERT INTO `students` VALUES (1, 'สมชาย', 'ใจดี', 1, 1, 'hashedpassword1', 'กำลังศึกษา');
INSERT INTO `students` VALUES (2, 'สมหญิง', 'มีใจ', 1, 2, 'hashedpassword2', 'กำลังศึกษา');
INSERT INTO `students` VALUES (3, 'ปรีชา', 'ยินดี', 2, 3, 'hashedpassword3', 'กำลังศึกษา');
INSERT INTO `students` VALUES (4, 'ประภา', 'มีกิจ', 2, 4, 'hashedpassword4', 'กำลังศึกษา');
INSERT INTO `students` VALUES (5, 'ชาติชาย', 'รักษ์ธรรม', 3, 5, 'hashedpassword5', 'กำลังศึกษา');
INSERT INTO `students` VALUES (6, 'ชาลี', 'รักชาติ', 3, 6, 'hashedpassword6', 'กำลังศึกษา');
INSERT INTO `students` VALUES (7, 'ธนกร', 'พาลี', 1, 1, 'hashedpassword7', 'กำลังศึกษา');
INSERT INTO `students` VALUES (8, 'ธนิดา', 'มารยาทดี', 1, 2, 'hashedpassword8', 'กำลังศึกษา');
INSERT INTO `students` VALUES (9, 'อารีย์', 'ประสงค์ดี', 2, 3, 'hashedpassword9', 'กำลังศึกษา');
INSERT INTO `students` VALUES (10, 'อานนท์', 'ศรีทอง', 2, 4, 'hashedpassword10', 'กำลังศึกษา');
INSERT INTO `students` VALUES (11, 'สมชาย', 'ทวีสุข', 1, 1, 'hashedpassword1', 'ออกจากการศึกษา');
INSERT INTO `students` VALUES (12, 'สุภาพร', 'ทวีสุข', 2, 2, 'hashedpassword2', 'กำลังศึกษา');
INSERT INTO `students` VALUES (13, 'เกษรา', 'ทองดี', 3, 3, 'hashedpassword3', 'กำลังศึกษา');
INSERT INTO `students` VALUES (14, 'ชัยพล', 'สุขสันต์', 1, 4, 'hashedpassword4', 'กำลังศึกษา');
INSERT INTO `students` VALUES (15, 'นันทนา', 'จันทร์เจริญ', 2, 5, 'hashedpassword5', 'กำลังศึกษา');
INSERT INTO `students` VALUES (16, 'ธนกฤต', 'ชัยเจริญ', 3, 6, 'hashedpassword6', 'กำลังศึกษา');
INSERT INTO `students` VALUES (17, 'พิมพ์ลภัส', 'ภู่ทอง', 1, 2, 'hashedpassword7', 'กำลังศึกษา');
INSERT INTO `students` VALUES (18, 'วรรณา', 'สวัสดิ์', 2, 3, 'hashedpassword8', 'กำลังศึกษา');
INSERT INTO `students` VALUES (19, 'ประเสริฐ', 'อร่าม', 3, 4, 'hashedpassword9', 'กำลังศึกษา');
INSERT INTO `students` VALUES (20, 'รุ่งทิวา', 'แก้วมณี', 1, 5, 'hashedpassword10', 'ออกจากการศึกษา');

SET FOREIGN_KEY_CHECKS = 1;
