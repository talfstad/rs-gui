DELIMITER //
DROP PROCEDURE IF EXISTS get_links;
CREATE PROCEDURE get_links 
(IN in_url VARCHAR(200),
 IN in_user VARCHAR(100))
BEGIN
    SELECT links.domain, links.link, links.bc_link, links.user_link, all_domains.rate, all_domains.bc_rate
    FROM links
    INNER JOIN all_domains
    ON links.domain = all_domains.url
    WHERE in_url = links.domain AND in_user = links.user AND in_user = all_domains.user;
END ; //
DELIMITER ;



DELIMITER //
DROP PROCEDURE IF EXISTS insert_domain;
CREATE PROCEDURE insert_domain
(IN in_url VARCHAR(1000),
 IN in_user VARCHAR(100))
BEGIN
    IF (in_url != '' AND in_url IS NOT NULL) THEN
      IF EXISTS (SELECT * FROM all_domains WHERE (url = in_url AND user = in_user)) THEN
            UPDATE all_domains SET count = count + 1 WHERE (url = in_url AND user = in_user);
      ELSE
            IF EXISTS (SELECT url FROM my_domains WHERE (in_url LIKE CONCAT('%', url, '%') AND user = in_user)) THEN
                INSERT INTO all_domains (url, registered, count, user) VALUES(in_url, 1, 1, in_user);
            ELSE
                INSERT INTO all_domains (url, registered, count, user) VALUES(in_url, 0, 1, in_user);
            END IF;
        END IF;
    END IF;
END ; //
DELIMITER ;