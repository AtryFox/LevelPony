CREATE TABLE IF NOT EXISTS `levels` (
  `guild` VARCHAR(18) NOT NULL,
  `user` VARCHAR(18) NOT NULL,
  `exp` BIGINT NULL,
  PRIMARY KEY (`guild`, `user`))