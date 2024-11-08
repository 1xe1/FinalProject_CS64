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

 Date: 07/11/2024 15:43:19
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admins
-- ----------------------------
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins`  (
  `AdminID` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'รหัสผู้ดูแลระบบ',
  `FirstName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'ชื่อผู้ดูแลระบบ',
  `LastName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'นามสกุลผู้ดูแลระบบ',
  `Email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'อีเมล',
  `PasswordHash` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'รหัสผ่านที่เข้ารหัสแล้ว',
  PRIMARY KEY (`AdminID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = 'ตารางสำหรับจัดเก็บข้อมูลผู้ดูแลระบบ' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for departments
-- ----------------------------
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments`  (
  `DepartmentID` int NOT NULL COMMENT 'รหัสสาขาวิชา',
  `DepartmentName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'ชื่อสาขาวิชา',
  `FacultyID` int NOT NULL COMMENT 'รหัสคณะ (Foreign Key)',
  PRIMARY KEY (`DepartmentID`, `FacultyID`) USING BTREE,
  INDEX `FacultyID`(`FacultyID` ASC) USING BTREE,
  CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`FacultyID`) REFERENCES `faculties` (`FacultyID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = 'ตารางสำหรับจัดเก็บข้อมูลสาขาวิชา' ROW_FORMAT = DYNAMIC;

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
-- Table structure for students
-- ----------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students`  (
  `StudentID` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'รหัสนักศึกษา',
  `FirstName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'ชื่อนักศึกษา',
  `LastName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'นามสกุลนักศึกษา',
  `FacultyID` int NULL DEFAULT NULL COMMENT 'รหัสคณะ (Foreign Key)',
  `DepartmentID` int NULL DEFAULT NULL COMMENT 'รหัสสาขาวิชา (Foreign Key)',
  `TeacherID` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'รหัสอาจารย์ที่ปรึกษา (Foreign Key)',
  `PasswordHash` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'รหัสผ่านที่เข้ารหัสแล้ว',
  `StudentStatus` enum('กำลังศึกษา','ออกจากการศึกษา','รอการอนุมัติ') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'รอการอนุมัติ',
  `LicensePlate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'หมายเลขทะเบียนรถ',
  PRIMARY KEY (`StudentID`) USING BTREE,
  INDEX `FacultyID`(`FacultyID` ASC) USING BTREE,
  INDEX `DepartmentID`(`DepartmentID` ASC) USING BTREE,
  INDEX `TeacherID`(`TeacherID` ASC) USING BTREE,
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`FacultyID`) REFERENCES `faculties` (`FacultyID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `students_ibfk_2` FOREIGN KEY (`DepartmentID`) REFERENCES `departments` (`DepartmentID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `students_ibfk_3` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`TeacherID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = 'ตารางสำหรับจัดเก็บข้อมูลนักศึกษา' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for teachers
-- ----------------------------
DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers`  (
  `TeacherID` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'รหัสอาจารย์',
  `FirstName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'ชื่ออาจารย์',
  `LastName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'นามสกุลอาจารย์',
  `Email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'อีเมล',
  `PasswordHash` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'รหัสผ่านที่เข้ารหัสแล้ว',
  `FacultyID` int NULL DEFAULT NULL COMMENT 'รหัสคณะ (Foreign Key)',
  `DepartmentID` int NULL DEFAULT NULL COMMENT 'รหัสสาขาวิชา (Foreign Key)',
  PRIMARY KEY (`TeacherID`) USING BTREE,
  INDEX `FacultyID`(`FacultyID` ASC) USING BTREE,
  INDEX `DepartmentID`(`DepartmentID` ASC) USING BTREE,
  CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`FacultyID`) REFERENCES `faculties` (`FacultyID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_2` FOREIGN KEY (`DepartmentID`) REFERENCES `departments` (`DepartmentID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = 'ตารางสำหรับจัดเก็บข้อมูลอาจารย์' ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
