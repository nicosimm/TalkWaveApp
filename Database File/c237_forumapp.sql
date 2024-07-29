-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 04, 2024 at 05:09 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `freedb_talkwaveapp`
--

CREATE DATABASE IF NOT EXISTS `freedb_talkwaveapp` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `freedb_talkwaveapp`;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `postId` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `postName` varchar(200) NOT NULL,
  `postDetails` varchar(200) NOT NULL, 
  `userId` VARCHAR(32) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `commentId` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `commentDetails` varchar(500) NOT NULL,
  `userId` varchar(30) NOT NULL,
  `postId` int(11) NOT NULL,
  `datePublished` DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(500) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`postId`, `postName`, `postDetails`, `userId`) VALUES
(1, 'How to clean stove', "this is how to clean the stove using just 2 ingredients..." , 1),
(2, 'What is i love you in french', "I want to confess to my french boyfriend in french..." , 2),
(3, 'Who is this celebrity?', "Many people crowded around him, who is he?", 3),
(4, 'How to make a cake', "First, prepare these ingredients..." , 4),
(5, 'What is the best movie of 2023?', "The best movie of 2023 in my opinion is..." , 5);


--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`commentId`, `commentDetails`, `userId`, `postId`, `datePublished`) VALUES
(1, 'I love this!', 'Johnny', 1, '2024-05-08'),
(2, 'Wow! Thanks for the info', 'happybanana309', 2, '2024-05-08'),
(3, 'I think this celebrity is from a South Korean Boy Band called BTS...', 'lOveGames78', 3, '2024-05-08'),
(4, 'can i replace all purpose flour with plain flour?', 'baker123', 4, '2024-05-08'),
(5, 'i think Oppenheimer is the best movie in 2023 for me!', 'moviebuff', 5, '2024-05-08');

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `password`) VALUES
('James', '1234'),
('Aason', 'wasd'),
('Nico', 'abcd'),
('Larru', 'ab12');


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
