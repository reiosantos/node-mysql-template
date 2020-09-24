-- ----------------- --
--      CLEAN UP     --
-- ----------------- --

DROP PROCEDURE IF EXISTS addcol;
DROP PROCEDURE IF EXISTS dropcol;
DROP PROCEDURE IF EXISTS create_constraint_if_not_exists;
DROP PROCEDURE IF EXISTS drop_constraint_if_exists;

;;

-- ----------------- --
--        UTIL       --
-- ----------------- --

CREATE PROCEDURE addcol(schemaname TEXT, tablename TEXT, colname TEXT, coltype TEXT)
    DETERMINISTIC
BEGIN

  DECLARE col_name TEXT;
  SET col_name = (SELECT
            COLUMN_NAME
          FROM
            information_schema.COLUMNS
          WHERE
            TABLE_SCHEMA = schemaname AND
            TABLE_NAME =  tablename   AND
            column_name=  colname
          );

  IF(col_name IS NULL ) THEN
    SET col_name = colname;
        SET @queryAlterTable = CONCAT('alter table ' ,schemaname, '.', tablename , ' add column ', colname , ' ' , coltype);
        PREPARE stmt FROM @queryAlterTable;
    EXECUTE stmt;
  ELSE
    SET col_name = CONCAT( colname ,' Already exist');
  END IF;

END

;;

CREATE PROCEDURE dropcol(schemaname TEXT,tablename TEXT,colname TEXT)
    DETERMINISTIC
BEGIN

  DECLARE col_name TEXT;
  SET col_name = (SELECT
            COLUMN_NAME
          FROM
            information_schema.COLUMNS
          WHERE
            TABLE_SCHEMA = schemaname AND
            TABLE_NAME =  tablename   AND
            column_name=  colname
          );


  IF(col_name IS NULL ) THEN
    SET col_name = CONCAT( colname ,' Does not exist');
  ELSE
    SET col_name = colname;
        SET @queryAlterTable = CONCAT('alter table ' ,schemaname, '.', tablename , ' drop column ', colname);
        PREPARE stmt FROM @queryAlterTable;
    EXECUTE stmt;
  END IF;

END

;;

CREATE PROCEDURE create_constraint_if_not_exists(s_name TEXT,t_name TEXT,c_name TEXT,constraint_sql TEXT)
    DETERMINISTIC
BEGIN

    IF NOT EXISTS (SELECT  constraint_name
                   FROM information_schema.table_constraints
                   WHERE TABLE_SCHEMA = s_name AND constraint_name = c_name) THEN
        SET @queryAlterTable = CONCAT('ALTER TABLE ', s_name , '.' , t_name ,' ADD CONSTRAINT ' , c_name , ' ' , constraint_sql);
        PREPARE stmt FROM @queryAlterTable;
    EXECUTE stmt;
    END IF;
END

;;


CREATE PROCEDURE drop_constraint_if_exists(s_name TEXT,t_name TEXT, c_type TEXT, c_name TEXT)
    DETERMINISTIC
BEGIN

    IF (SELECT  constraint_name
                   FROM information_schema.table_constraints
                   WHERE TABLE_SCHEMA = s_name AND constraint_name = c_name) THEN
        SET @queryAlterTable = CONCAT('ALTER TABLE ', s_name , '.' , t_name ,' DROP ' , c_type, ' ', c_name);
        PREPARE stmt FROM @queryAlterTable;
    EXECUTE stmt;
    END IF;
END

;;

-- -- -------------------
-- -- TABLE container ---
-- -- -------------------
-- CREATE TABLE IF NOT EXISTS user (id integer NOT NULL AUTO_INCREMENT, created_at datetime NOT NULL, updated_at datetime NOT NULL, PRIMARY KEY(id));
--
-- CALL addcol('{schema}','user', 'user_id', 'integer NOT NULL');
-- CALL addcol('{schema}','user', 'venue', 'character varying(255) NOT NULL');
-- CALL addcol('{schema}','user', 'container_id', 'character varying(255) NOT NULL');
-- CALL addcol('{schema}','user', 'columns', 'json');
-- CALL addcol('{schema}','user', 'advanced', 'json');
-- CALL addcol('{schema}','user', 'status', 'json');
-- CALL addcol('{schema}','user', 'booking_id', 'integer');
-- CALL addcol('{schema}','user', 'booking_ref', 'character varying(255)');
-- CALL addcol('{schema}','user', 'archive', 'boolean NOT NULL DEFAULT 0');
-- CALL addcol('{schema}','user', 'watchlist_status', 'character varying(255) NOT NULL');
--
-- CALL create_constraint_if_not_exists('{schema}','user','UN_venue_user_id_container_id',' UNIQUE KEY (`venue`,`user_id`,`container_id`)');
