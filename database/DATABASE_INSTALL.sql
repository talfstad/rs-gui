# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 54.187.151.91 (MySQL 5.5.38-0ubuntu0.14.04.1)
# Database: domains_dev
# Generation Time: 2014-11-08 20:18:46 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table all_domains
# ------------------------------------------------------------

DROP TABLE IF EXISTS `all_domains`;

CREATE TABLE `all_domains` (
  `url` varchar(1000) NOT NULL,
  `registered` tinyint(1) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `count` int(11) DEFAULT NULL,
  `rate` int(11) NOT NULL DEFAULT '0',
  `bc_rate` int(11) NOT NULL DEFAULT '0',
  `user` varchar(100) NOT NULL,
  `base_url` varchar(200) NOT NULL,
  `creation_date` datetime DEFAULT '2014-10-29 12:00:00',
  `replaced_links_clicked` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



DROP TABLE IF EXISTS `links`;

CREATE TABLE `links` (
  `domain` varchar(200) DEFAULT NULL,
  `link` varchar(200) DEFAULT NULL,
  `bc_link` varchar(200) NOT NULL DEFAULT '',
  `user_link` varchar(200) NOT NULL DEFAULT '',
  `user` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `my_domains`;

CREATE TABLE `my_domains` (
  `url` varchar(200) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `user` varchar(100) DEFAULT NULL,
  `hash` varchar(200) DEFAULT NULL,
  `secret_username` varchar(60) DEFAULT NULL,
  `approved` tinyint(1) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `last_login` datetime NOT NULL,
  `auth_token` TEXT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`user`),
  UNIQUE KEY `auth_token` (`auth_token`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

)



--
-- Dumping routines (PROCEDURE) for database 'domains_dev'
--
DELIMITER ;;

# Dump of PROCEDURE delete_my_domain
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `delete_my_domain` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `delete_my_domain`(IN `in_id` int, IN `in_user` VARCHAR(100))
BEGIN
   SELECT url INTO @var_url FROM my_domains WHERE id = in_id LIMIT 1;
    DELETE from my_domains where id = in_id; UPDATE all_domains set registered = 0 WHERE user = in_user AND base_url = @var_url;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE get_links
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `get_links` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `get_links`(IN in_url VARCHAR(200),
 IN in_user VARCHAR(100))
BEGIN
    SELECT links.domain, links.link, links.bc_link, links.user_link, all_domains.rate, all_domains.bc_rate
    FROM links
    INNER JOIN all_domains
    ON links.domain = all_domains.url
    WHERE in_url = links.domain AND in_user = links.user AND in_user = all_domains.user;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE insert_domain
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `insert_domain` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `insert_domain`(IN `in_url` VARCHAR(1000), IN `in_user` VARCHAR(100), IN `in_date` DATETIME, IN `in_base_url` VARCHAR(200))
BEGIN
    IF (in_url != '' AND in_url IS NOT NULL) THEN
      IF EXISTS (SELECT * FROM all_domains WHERE (url = in_url AND user = in_user)) THEN
              UPDATE all_domains SET count = count + 1 WHERE (url = in_url AND user = in_user);
      ELSE
            IF EXISTS (SELECT url FROM my_domains WHERE (in_base_url = my_domains.base_url AND my_domains.user = in_user)) THEN
                INSERT INTO all_domains (url, registered, count, user, creation_date, base_url) VALUES(in_url, 1, 1, in_user, in_date, in_base_url);
            ELSE
                INSERT INTO all_domains (url, registered, count, user, creation_date, base_url) VALUES(in_url, 0, 1, in_user, in_date, in_base_url);
            END IF;
        END IF;
    END IF;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE insert_link
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `insert_link` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `insert_link`(IN in_domain VARCHAR(200),
 IN in_link VARCHAR(200),
 IN in_user VARCHAR(100))
BEGIN
    IF NOT EXISTS (SELECT * FROM links WHERE (domain = in_domain AND link = in_link AND user = in_user)) THEN
        INSERT INTO links (domain, link, user) VALUES(in_domain, in_link, in_user);
    END IF;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE insert_my_domain
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `insert_my_domain` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `insert_my_domain`(IN `in_url` VARCHAR(1000), IN `in_user` VARCHAR(100))
BEGIN
    UPDATE all_domains SET registered=1 WHERE all_domains.base_url = in_url AND all_domains.user = in_user;
    INSERT INTO my_domains (url, user) VALUES(in_url, in_user);
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE insert_user_link
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `insert_user_link` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `insert_user_link`(IN in_domain VARCHAR(200),
 IN in_link VARCHAR(200),
 IN in_user_link VARCHAR(200),
 IN in_user VARCHAR(100))
BEGIN
    IF EXISTS (SELECT * FROM links WHERE (domain = in_domain AND link = in_link AND user = in_user)) THEN
         UPDATE links SET user_link = in_user_link WHERE (links.domain = in_domain AND link = in_link AND user = in_user);
    ELSE
        INSERT INTO links (domain, link, user_link, user) VALUES(in_domain, in_link, in_user_link, in_user);
    END IF;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE test_proc
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `test_proc` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `test_proc`(IN in_url VARCHAR(1000))
BEGIN
        INSERT INTO all_domains (url, registered) VALUES(in_url, 1);
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
# Dump of PROCEDURE test_query
# ------------------------------------------------------------

/*!50003 DROP PROCEDURE IF EXISTS `test_query` */;;
/*!50003 SET SESSION SQL_MODE=""*/;;
/*!50003 CREATE*/ /*!50020 DEFINER=`root`@`localhost`*/ /*!50003 PROCEDURE `test_query`(IN in_url VARCHAR(200))
BEGIN
    SELECT * FROM all_domains where url like in_url;
END */;;

/*!50003 SET SESSION SQL_MODE=@OLD_SQL_MODE */;;
DELIMITER ;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
