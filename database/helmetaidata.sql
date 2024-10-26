-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 26, 2024 at 01:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `helmetaidata`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `AdminID` varchar(20) NOT NULL COMMENT 'รหัสผู้ดูแลระบบ',
  `FirstName` varchar(255) NOT NULL COMMENT 'ชื่อผู้ดูแลระบบ',
  `LastName` varchar(255) NOT NULL COMMENT 'นามสกุลผู้ดูแลระบบ',
  `Email` varchar(255) NOT NULL COMMENT 'อีเมล',
  `PasswordHash` varchar(255) NOT NULL COMMENT 'รหัสผ่านที่เข้ารหัสแล้ว'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='ตารางสำหรับจัดเก็บข้อมูลผู้ดูแลระบบ' ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`AdminID`, `FirstName`, `LastName`, `Email`, `PasswordHash`) VALUES
('Admin@01', 'Admin@01', 'Admin@01', 'Admin01@gmail.com', '$2a$10$vMB8xxCwO4d1CjPULyWj6u8SilKCkFVewPK5qAp59F3dE76qZFQbS');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `DepartmentID` int(11) NOT NULL COMMENT 'รหัสสาขาวิชา',
  `DepartmentName` varchar(255) NOT NULL COMMENT 'ชื่อสาขาวิชา',
  `FacultyID` int(11) DEFAULT NULL COMMENT 'รหัสคณะ (Foreign Key)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='ตารางสำหรับจัดเก็บข้อมูลสาขาวิชา' ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`DepartmentID`, `DepartmentName`, `FacultyID`) VALUES
(1, 'วิศวกรรมคอมพิวเตอร์', 1),
(2, 'วิศวกรรมเครื่องกล', 1),
(3, 'การจัดการ', 2),
(4, 'การตลาด', 2),
(5, 'พัฒนาการเกษตร', 3),
(6, 'สัตว์ศาสตร์', 3),
(7, 'วิทยาการคอมพิวเตอร์', 4),
(8, 'เทคโนโลยีสารสนเทศ', 4);

-- --------------------------------------------------------

--
-- Table structure for table `faculties`
--

CREATE TABLE `faculties` (
  `FacultyID` int(11) NOT NULL COMMENT 'รหัสคณะ',
  `FacultyName` varchar(255) NOT NULL COMMENT 'ชื่อคณะ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='ตารางสำหรับจัดเก็บข้อมูลคณะ' ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `faculties`
--

INSERT INTO `faculties` (`FacultyID`, `FacultyName`) VALUES
(1, 'คณะวิศวกรรมศาสตร์'),
(2, 'คณะบริหารธุรกิจ'),
(3, 'คณะเกษตรศาสตร์'),
(4, 'เทคโนโลยีคอมพิวเตอร์');

-- --------------------------------------------------------

--
-- Table structure for table `helmetdetection`
--

CREATE TABLE `helmetdetection` (
  `DetectionID` int(11) NOT NULL COMMENT 'รหัสการตรวจจับ (Primary Key)',
  `StudentID` varchar(20) DEFAULT NULL COMMENT 'รหัสนักศึกษา (Foreign Key)',
  `DetectionTime` datetime NOT NULL COMMENT 'เวลาการตรวจจับ',
  `ImageURL` text DEFAULT NULL COMMENT 'ลิงค์หรือที่อยู่ของภาพการตรวจจับ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='ตารางสำหรับจัดเก็บข้อมูลการตรวจจับหมวกกันน็อก' ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `helmetdetection`
--

INSERT INTO `helmetdetection` (`DetectionID`, `StudentID`, `DetectionTime`, `ImageURL`) VALUES
(0, '641463021', '2024-10-24 21:35:40', NULL),
(1, '641453001', '2024-08-29 08:00:00', 'http://example.com/image1.jpg'),
(2, '641453001', '2024-08-29 08:30:00', 'http://example.com/image2.jpg'),
(3, '641453001', '2024-08-29 09:00:00', 'http://example.com/image3.jpg'),
(4, '641453002', '2024-08-29 09:00:00', 'http://example.com/image4.jpg'),
(5, '641453002', '2024-08-29 09:30:00', 'http://example.com/image5.jpg'),
(6, '641453002', '2024-08-29 10:00:00', 'http://example.com/image6.jpg'),
(7, '641453003', '2024-08-29 10:00:00', 'http://example.com/image7.jpg'),
(8, '641453003', '2024-08-29 10:30:00', 'http://example.com/image8.jpg'),
(9, '641453003', '2024-08-29 11:00:00', 'http://example.com/image9.jpg'),
(10, '641453003', '2024-08-29 11:30:00', 'http://example.com/image10.jpg'),
(11, '641453004', '2024-08-29 12:00:00', 'http://example.com/image11.jpg'),
(12, '641453004', '2024-08-29 12:30:00', 'http://example.com/image12.jpg'),
(13, '641453004', '2024-08-29 13:00:00', 'http://example.com/image13.jpg'),
(14, '641453005', '2024-08-29 13:30:00', 'http://example.com/image14.jpg'),
(15, '641453005', '2024-08-29 14:00:00', 'http://example.com/image15.jpg'),
(16, '641453005', '2024-08-29 14:30:00', 'http://example.com/image16.jpg'),
(17, '641453005', '2024-08-29 15:00:00', 'http://example.com/image17.jpg'),
(18, '641453006', '2024-08-29 15:30:00', 'http://example.com/image18.jpg'),
(19, '641453006', '2024-08-29 16:00:00', 'http://example.com/image19.jpg'),
(20, '641453006', '2024-08-29 16:30:00', 'http://example.com/image20.jpg'),
(21, '641463021', '2024-08-29 22:29:28', 'http://example.com/image20.jpg'),
(22, '641463021', '2024-07-24 22:38:30', 'http://example.com/image20.jpg'),
(23, '641463021', '2024-08-28 22:38:30', 'http://example.com/image20.jpg'),
(24, '641463021', '2024-08-29 22:29:28', 'http://example.com/image20.jpg'),
(25, '641463022', '2024-06-19 23:13:00', NULL),
(26, '641463022', '2024-06-26 23:13:23', NULL),
(27, '641463021', '2024-08-30 00:25:35', NULL),
(28, '641463022', '2024-08-30 00:41:12', NULL),
(81, '641453003', '2024-09-19 02:21:43', 'StudentWithoutHelmet/1725528928_licensePlate_3.png'),
(82, '641453001', '2024-09-19 02:21:43', 'StudentWithoutHelmet/2024-09-15_22-47-29_WithoutHelmet_licensePlate.jpg'),
(83, '641453001', '2024-09-19 02:21:43', 'StudentWithoutHelmet/Test10.png'),
(84, '641453002', '2024-09-19 02:21:43', 'StudentWithoutHelmet/Test2.jpg'),
(85, '641453003', '2024-09-18 21:29:41', NULL),
(86, '641453010', '2024-09-18 21:30:17', NULL),
(87, '641453003', '2024-09-19 02:46:51', '/licensePlateFound\\1725528928_licensePlate_3.png'),
(88, '641453001', '2024-09-19 02:46:51', '/licensePlateFound\\2024-09-15_22-47-29_WithoutHelmet_licensePlate.jpg'),
(89, '641453001', '2024-09-19 02:46:51', '/licensePlateFound\\Test10.png'),
(90, '641453002', '2024-09-19 02:46:51', '/licensePlateFound\\Test2.jpg'),
(91, '641453003', '2024-09-19 02:50:25', '/licensePlateFound\\1725528928_licensePlate_3.png'),
(92, '641453001', '2024-09-19 02:50:25', '/licensePlateFound\\2024-09-15_22-47-29_WithoutHelmet_licensePlate.jpg'),
(93, '641453001', '2024-09-19 02:50:25', '/licensePlateFound\\Test10.png'),
(94, '641453002', '2024-09-19 02:50:25', '/licensePlateFound\\Test2.jpg'),
(95, '641463020', '2024-09-19 22:17:13', '/licensePlateFound\\2024-09-19_22-16-04_WithoutHelmet_licensePlate.jpg'),
(96, '641463020', '2024-09-19 22:17:13', '/licensePlateFound\\2024-09-19_22-16-05_WithoutHelmet_licensePlate.jpg'),
(97, '641453001', '2024-09-19 22:17:13', '/licensePlateFound\\2024-09-19_22-16-23_WithoutHelmet_licensePlate.jpg'),
(98, '641453001', '2024-09-20 01:01:18', '/licensePlateFound\\2024-09-20_01-00-57_WithoutHelmet_licensePlate.jpg'),
(99, '641453001', '2024-09-20 01:01:18', '/licensePlateFound\\2024-09-20_01-00-58_WithoutHelmet_licensePlate.jpg'),
(100, '641453001', '2024-09-20 01:01:18', '/licensePlateFound\\2024-09-20_01-00-59_WithoutHelmet_licensePlate.jpg'),
(101, '641463020', '2024-09-20 01:06:26', '/licensePlateFound\\DSC_8230-1024x685 copy.jpg'),
(102, '641463020', '2024-09-20 01:10:29', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/DSC_8230-1024x685 copy 2.jpg'),
(103, '641453004', '2024-09-20 01:12:13', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_01-01-10_WithoutHelmet_licensePlate.jpg'),
(104, '641453004', '2024-09-20 01:12:13', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_01-01-11_WithoutHelmet_licensePlate.jpg'),
(105, '641453004', '2024-09-20 01:12:13', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_01-01-12_WithoutHelmet_licensePlate.jpg'),
(106, '641463020', '2024-09-20 01:12:13', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/DSC_8230-1024x685 copy.jpg'),
(107, '641463020', '2024-09-20 01:12:13', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/DSC_8230-1024x685.jpg'),
(108, '641453004', '2024-09-20 09:22:33', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_09-22-20_WithoutHelmet_licensePlate.jpg'),
(109, '641453004', '2024-09-20 09:22:33', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_09-22-21_WithoutHelmet_licensePlate.jpg'),
(110, '641453004', '2024-09-20 09:22:33', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_09-22-22_WithoutHelmet_licensePlate.jpg'),
(111, '641453004', '2024-09-20 09:23:38', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_09-22-23_WithoutHelmet_licensePlate.jpg'),
(112, '641453004', '2024-09-20 09:23:38', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_09-22-24_WithoutHelmet_licensePlate.jpg'),
(113, '641453004', '2024-09-20 09:23:38', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_09-22-26_WithoutHelmet_licensePlate.jpg'),
(114, '641453004', '2024-09-20 09:23:38', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_09-22-27_WithoutHelmet_licensePlate.jpg'),
(115, '641453004', '2024-09-20 09:23:38', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_09-23-28_WithoutHelmet_licensePlate.jpg'),
(116, '641453004', '2024-09-20 09:23:38', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-09-20_09-23-29_WithoutHelmet_licensePlate.jpg'),
(117, '641463020', '2024-09-21 19:40:04', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/DSC_8230-1024x685 copy.jpg'),
(118, '641453001', '2024-10-08 23:48:04', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-08_23-41-30_WithoutHelmet_licensePlate.jpg'),
(119, '641453001', '2024-10-08 23:48:04', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-08_23-41-31_WithoutHelmet_licensePlate.jpg'),
(120, '641453001', '2024-10-08 23:48:04', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-08_23-41-32_WithoutHelmet_licensePlate.jpg'),
(121, '641453004', '2024-10-08 23:48:04', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-08_23-41-42_WithoutHelmet_licensePlate.jpg'),
(122, '641453004', '2024-10-08 23:48:04', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-08_23-41-43_WithoutHelmet_licensePlate.jpg'),
(123, '641453004', '2024-10-08 23:48:04', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-08_23-41-44_WithoutHelmet_licensePlate.jpg'),
(124, '641453004', '2024-10-08 23:48:04', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-08_23-41-45_WithoutHelmet_licensePlate.jpg'),
(125, '641453005', '2024-10-09 02:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-00-58_WithoutHelmet_licensePlate.jpg'),
(126, '641453005', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-00-59_WithoutHelmet_licensePlate.jpg'),
(127, '641453005', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-00_WithoutHelmet_licensePlate.jpg'),
(128, '641453001', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-11_WithoutHelmet_licensePlate.jpg'),
(129, '641453001', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-12_WithoutHelmet_licensePlate.jpg'),
(130, '641453001', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-13_WithoutHelmet_licensePlate.jpg'),
(131, '641453001', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-14_WithoutHelmet_licensePlate.jpg'),
(132, '641453004', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-19_WithoutHelmet_licensePlate.jpg'),
(133, '641453004', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-20_WithoutHelmet_licensePlate.jpg'),
(134, '641453004', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-21_WithoutHelmet_licensePlate.jpg'),
(135, '641453004', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-22_WithoutHelmet_licensePlate.jpg'),
(136, '641453004', '2024-10-09 00:03:12', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-23_WithoutHelmet_licensePlate.jpg'),
(137, '641453005', '2024-10-09 00:17:59', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-00_WithoutHelmet_licensePlate.jpg'),
(138, '641453001', '2024-10-09 00:17:59', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-14_WithoutHelmet_licensePlate.jpg'),
(139, '641453004', '2024-10-09 00:17:59', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-23_WithoutHelmet_licensePlate.jpg'),
(140, '641453005', '2024-10-09 00:23:30', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-00_WithoutHelmet_licensePlate.jpg'),
(141, '641453001', '2024-10-09 00:23:30', 'http://localhost/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-14_WithoutHelmet_licensePlate.jpg'),
(142, '641453004', '2024-10-09 00:23:30', 'http://localhost:8080/thesis_crru_Ai/ai1/StudentWithoutHelmet/2024-10-09_00-01-23_WithoutHelmet_licensePlate.jpg'),
(143, '641453010', '2024-10-24 21:37:02', NULL),
(144, '641453010', '2024-10-24 19:37:02', NULL),
(145, '641453010', '2024-10-24 17:37:02', NULL),
(146, '641453010', '2024-10-24 13:37:02', NULL),
(147, '641453010', '2024-10-24 08:37:02', NULL),
(148, '641453010', '2024-10-24 12:37:02', NULL),
(149, '641453010', '2024-10-24 18:37:02', NULL),
(150, '641453010', '2024-10-24 07:37:02', NULL),
(151, '641453010', '2024-10-24 06:37:02', NULL),
(152, '641453010', '2024-10-24 01:37:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `StudentID` varchar(20) NOT NULL COMMENT 'รหัสนักศึกษา',
  `FirstName` varchar(255) NOT NULL COMMENT 'ชื่อนักศึกษา',
  `LastName` varchar(255) NOT NULL COMMENT 'นามสกุลนักศึกษา',
  `FacultyID` int(11) DEFAULT NULL COMMENT 'รหัสคณะ (Foreign Key)',
  `DepartmentID` int(11) DEFAULT NULL COMMENT 'รหัสสาขาวิชา (Foreign Key)',
  `TeacherID` varchar(20) DEFAULT NULL COMMENT 'รหัสอาจารย์ที่ปรึกษา (Foreign Key)',
  `PasswordHash` varchar(255) NOT NULL COMMENT 'รหัสผ่านที่เข้ารหัสแล้ว',
  `StudentStatus` enum('กำลังศึกษา','ออกจากการศึกษา','รอการอนุมัติ') NOT NULL DEFAULT 'กำลังศึกษา' COMMENT 'สถานะการศึกษา',
  `LicensePlate` varchar(20) DEFAULT NULL COMMENT 'หมายเลขทะเบียนรถ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='ตารางสำหรับจัดเก็บข้อมูลนักศึกษา' ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`StudentID`, `FirstName`, `LastName`, `FacultyID`, `DepartmentID`, `TeacherID`, `PasswordHash`, `StudentStatus`, `LicensePlate`) VALUES
('641453001', 'สมชาย', 'ดี', 1, 2, 'Teacher@01', '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iW', 'กำลังศึกษา', '1กษ7233'),
('641453002', 'สมหญิง', 'ดี', 1, 2, 'Teacher@01', '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iW', 'กำลังศึกษา', '6กผ40'),
('641453003', 'สมศรี', 'ดี', 2, 3, 'Teacher@01', '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iW', 'ออกจากการศึกษา', 'รวย55'),
('641453004', 'สมเกียรติ', 'ดี', 4, 7, 'Teacher@02', '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iW', 'กำลังศึกษา', '7กจ3572'),
('641453005', 'สมพงษ์', 'ดี', 3, 6, 'Teacher@01', '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iW', 'กำลังศึกษา', '5กร1995'),
('641453006', 'สมปอง', 'ดี', 3, 5, 'Teacher@01', '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iW', 'กำลังศึกษา', '6F6789'),
('641453007', 'สมบัติ', 'ดี', 1, 1, 'Teacher@01', '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iW', 'ออกจากการศึกษา', '7G7890'),
('641453008', 'สมพร', 'ดี', 1, 2, 'Teacher@01', '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iW', 'กำลังศึกษา', '8H8901'),
('641453009', 'สมเพียร', 'ดี', 2, 4, 'Teacher@01', '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iWa', 'รอการอนุมัติ', '9I9012'),
('641453010', 'สมอรรถ', 'ดี', 2, 3, 'Teacher@01', '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iWa', 'รอการอนุมัติ', '10J012'),
('641463000', '641463000', '641463000', 1, 1, 'Teacher@02', '$2a$10$BMFfWJZfK0IPD5LEFdeQ2eVPNjZlrDuP2ns5HtqqR37AHORqQKovu', 'กำลังศึกษา', 'asdfa'),
('641463020', 'อนุชิด', 'พาวง', 2, 3, 'Teacher@02', '$2a$10$ZPpQezcp1JfpEF0pRam32.eNK2ITQKnOM1KncimD7g1iWSdegoeba', 'กำลังศึกษา', '0000'),
('641463021', 'อนันต์', 'นามวงค์', 1, 1, 'Teacher@01', '$2b$10$p7tz7H7uMGYWwUigmWJRV.jBuw.Gv9KJn1F1vVBwFj4b1gg7.J9iW', 'กำลังศึกษา', 'กธ1669'),
('641463022', 'ทดสอบ', 'สอบทด', 1, 2, 'Teacher@01', '$2b$10$Nd3nTqBoMLRbx6HWvo82FuH8yYrNgmt89Y2ic5/OPcgxstdR8L8jO', 'กำลังศึกษา', 'ฌม125'),
('641463023', 'ทดสอบ1', 'สอบทด1', 1, 1, 'Teacher@01', '$2b$10$N1dx2/vdbeyCauN6SS96BelQ/w5HJCkZrgSw8mDcmZMwdX6ro9z0u', 'กำลังศึกษา', 'กรท45'),
('641463099', 'ยศพล', 'นามยี่', 2, 3, 'Teacher@02', '$2a$10$SoSOl0lrWY/D7y3K.OGMQO9.aFZtAhjCF.JXxj0pP/loy3Eb.KiTy', 'กำลังศึกษา', 'ฤก9921');

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `TeacherID` varchar(20) NOT NULL COMMENT 'รหัสอาจารย์',
  `FirstName` varchar(255) NOT NULL COMMENT 'ชื่ออาจารย์',
  `LastName` varchar(255) NOT NULL COMMENT 'นามสกุลอาจารย์',
  `Email` varchar(255) NOT NULL COMMENT 'อีเมล',
  `PasswordHash` varchar(255) NOT NULL COMMENT 'รหัสผ่านที่เข้ารหัสแล้ว',
  `FacultyID` int(11) DEFAULT NULL COMMENT 'รหัสคณะ (Foreign Key)',
  `DepartmentID` int(11) DEFAULT NULL COMMENT 'รหัสสาขาวิชา (Foreign Key)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='ตารางสำหรับจัดเก็บข้อมูลอาจารย์' ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`TeacherID`, `FirstName`, `LastName`, `Email`, `PasswordHash`, `FacultyID`, `DepartmentID`) VALUES
('Teacher@01', 'Teacher@01', 'Teacher@01', 'Teacher01@gmail.com', '$2a$10$eSgGaDfYmsxCP9OkZCZn7ujIwh/.gshbnw/EaB2AqeFtfMw8vMoSa', 1, 1),
('Teacher@02', 'Teacher@02', 'Teacher@02', 'Teacher02@gmail.com', '$2a$10$eSgGaDfYmsxCP9OkZCZn7ujIwh/.gshbnw/EaB2AqeFtfMw8vMoSa', 2, 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`AdminID`) USING BTREE;

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`DepartmentID`) USING BTREE,
  ADD KEY `FacultyID` (`FacultyID`) USING BTREE;

--
-- Indexes for table `faculties`
--
ALTER TABLE `faculties`
  ADD PRIMARY KEY (`FacultyID`) USING BTREE;

--
-- Indexes for table `helmetdetection`
--
ALTER TABLE `helmetdetection`
  ADD PRIMARY KEY (`DetectionID`) USING BTREE,
  ADD KEY `StudentID` (`StudentID`) USING BTREE;

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`StudentID`) USING BTREE,
  ADD KEY `FacultyID` (`FacultyID`) USING BTREE,
  ADD KEY `DepartmentID` (`DepartmentID`) USING BTREE,
  ADD KEY `TeacherID` (`TeacherID`) USING BTREE;

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`TeacherID`) USING BTREE,
  ADD KEY `FacultyID` (`FacultyID`) USING BTREE,
  ADD KEY `DepartmentID` (`DepartmentID`) USING BTREE;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`FacultyID`) REFERENCES `faculties` (`FacultyID`);

--
-- Constraints for table `helmetdetection`
--
ALTER TABLE `helmetdetection`
  ADD CONSTRAINT `helmetdetection_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`FacultyID`) REFERENCES `faculties` (`FacultyID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_2` FOREIGN KEY (`DepartmentID`) REFERENCES `departments` (`DepartmentID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_3` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`TeacherID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`FacultyID`) REFERENCES `faculties` (`FacultyID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `teachers_ibfk_2` FOREIGN KEY (`DepartmentID`) REFERENCES `departments` (`DepartmentID`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
