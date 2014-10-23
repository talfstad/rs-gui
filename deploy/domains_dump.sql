-- MySQL dump 10.13  Distrib 5.5.34, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: domains
-- ------------------------------------------------------
-- Server version	5.5.34-0ubuntu0.13.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `domains`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `domains` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `domains`;

--
-- Table structure for table `all_domains`
--

DROP TABLE IF EXISTS `all_domains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `all_domains` (
  `url` varchar(1000) DEFAULT NULL,
  `registered` tinyint(1) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `count` int(11) DEFAULT NULL,
  `rate` int(11) NOT NULL DEFAULT '0',
  `bc_rate` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `all_domains`
--

LOCK TABLES `all_domains` WRITE;
/*!40000 ALTER TABLE `all_domains` DISABLE KEYS */;
INSERT INTO `all_domains` VALUES ('getmensfitness.com',1,59,15108,0,0),('s3-us-west-2.amazonaws.com',0,64,49,0,0),('',0,65,106,0,0),('www.getmensfitness.com',1,66,282,0,0),('twowaywin.com',0,67,25,50,0),('2.hidemyass.com',0,68,1,0,0),('server8.kproxy.com',0,69,3,0,0),('maxfitdaily.org',0,75,1,0,0),('www.back2ripped.com',0,76,10392,0,0),('www.mymensfitness.com',0,77,2,0,0),('instafit.us',0,96,27370,0,0),('www.instafit.us',0,97,6148,0,0),('back2ripped.com',0,98,7,0,0),('back2jacked.com',0,99,11543,0,0),('test_domain1.com',0,102,167,40,50),('test_domain2.com',0,117,1,10,0),('back2fit.org',0,118,8,0,0),('www.back2fit.org',0,119,292,0,0),('bigTest.com',0,126,1,0,0);
/*!40000 ALTER TABLE `all_domains` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `links`
--

DROP TABLE IF EXISTS `links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `links` (
  `domain` varchar(200) DEFAULT NULL,
  `link` varchar(200) DEFAULT NULL,
  `bc_link` varchar(200) NOT NULL DEFAULT '',
  `user_link` varchar(200) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `links`
--

LOCK TABLES `links` WRITE;
/*!40000 ALTER TABLE `links` DISABLE KEYS */;
INSERT INTO `links` VALUES ('test_domain1.com','test_link1.com','davidsreallygay.com','http://davidsgay.com'),('test_domain1.com','test_link2.com','davidsreallygay.com','http://davidsgay.com'),('test_domain1.com','hyperfuel.com','trevorisadouche.biz','http://debuggin.biz'),('test_domain1.com','http://hyperfuel.com','trevorisadouche.biz','http://debuggin.biz'),('test_domain1.com','http://www.hyperfuel.com','trevorisadouche.biz','http://debuggin.biz'),('test_domain1.com','http://www.elevategf.com','gay.com','http://www.butt.com'),('getmensfitness.com','test.com','','http://second_test.com'),('bigTest.com','www.site3.com','','http://bsdfsf.net'),('bigTest.com','www.site4.com','',''),('bigTest2.com','www.site3.com','','http://ffffff.com'),('bigTest2.com','www.site4.com','','http://adfsdfa.com'),('bigTest3.com','www.site3.com','',''),('bigTest3.com','www.site4.com','','');
/*!40000 ALTER TABLE `links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `my_domains`
--

DROP TABLE IF EXISTS `my_domains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `my_domains` (
  `url` varchar(200) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `my_domains`
--

LOCK TABLES `my_domains` WRITE;
/*!40000 ALTER TABLE `my_domains` DISABLE KEYS */;
INSERT INTO `my_domains` VALUES ('getmensfitness.com',7),('www.getmensfitness.com',10);
/*!40000 ALTER TABLE `my_domains` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-06-14 19:56:55
