CREATE DATABASE IF NOT EXISTS holidayextras;

USE holidayextras;

CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(320) NOT NULL DEFAULT '',
  `given_name` varchar(50) NOT NULL DEFAULT '',
  `family_name` varchar(50) NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

