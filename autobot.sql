CREATE DATABASE `autobot` /*!40100 DEFAULT CHARACTER SET utf8 */;
CREATE TABLE `schedule` (
  `scheduleId` int(11) NOT NULL AUTO_INCREMENT,
  `unitId` int(11) DEFAULT NULL,
  `newState` int(11) DEFAULT NULL,
  `weekday` int(11) DEFAULT NULL,
  `isWeekly` tinyint(1) DEFAULT '0',
  `isDaily` tinyint(1) DEFAULT NULL,
  `useSunset` tinyint(1) DEFAULT NULL,
  `useSunrise` tinyint(1) DEFAULT NULL,
  `hour` int(11) DEFAULT '0',
  `min` int(11) DEFAULT '0',
  `sec` int(11) DEFAULT '0',
  PRIMARY KEY (`scheduleId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
CREATE TABLE `unit` (
  `unitId` int(11) NOT NULL AUTO_INCREMENT,
  `kakuId` int(11) DEFAULT NULL,
  `unitState` tinyint(1) DEFAULT NULL,
  `unitName` varchar(50) DEFAULT NULL,
  `unitDescr` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`unitId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
