CREATE TABLE `users` (
  `userID` INT NOT NULL AUTO_INCREMENT,
  `role` enum('p','dr') NOT NULL,
  `name` VARCHAR(500) NOT NULL,
  `email` VARCHAR(500) NOT NULL,
  `password` VARCHAR(500) NOT NULL,
  `dateReg` dateTime NOT NULL,
  `token` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`userID`)
);

CREATE TABLE `admin` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(500) NOT NULL,
  `email` VARCHAR(500) NOT NULL,
  `password` VARCHAR(500) NOT NULL,
  `token` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `admin` VALUES (1,'admin','admin@medhx.com','$2y$13$jvymQ5BMYtFAAR//RxmcL./qzuZZ5wm34ARB1Oo0qLKPw5jQEXrzK','..CcYPhVGjMuYQqZrCJFS/alJOdCTmDYdwixuhnu+XhXU=');

CREATE TABLE `doctors` (
  `docsID` INT NOT NULL AUTO_INCREMENT,
  `userID` INT NOT NULL,
  `organisation` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`docsID`),
  FOREIGN KEY (`userID`) REFERENCES `users`(`userID`)
);

CREATE TABLE `patient` (
  `patient_ref` VARCHAR(500) NOT NULL,
  `userID` INT NOT NULL,
  PRIMARY KEY (`patient_ref`),
  FOREIGN KEY (`userID`) REFERENCES `users`(`userID`)
);

CREATE TABLE `appointments` (
  `apptsID` INT NOT NULL AUTO_INCREMENT,
  `docID` INT NULL,
  `patient_ref` VARCHAR(500) NOT NULL,
  `location` VARCHAR(500) NOT NULL,
  `date` TIMESTAMP NOT NULL,
  PRIMARY KEY (`apptsID`),
  FOREIGN KEY (`docID`) REFERENCES `doctors`(`docsID`),
  FOREIGN KEY (`patient_ref`) REFERENCES `patient`(`patient_ref`)
);

CREATE TABLE `meds` (
  `medID` INT NOT NULL AUTO_INCREMENT,
  `docsID` INT NULL,
  `patient_ref` VARCHAR(500) NOT NULL,
  `med_name` VARCHAR(500) NOT NULL,
  `dose` VARCHAR(250) NOT NULL,
  PRIMARY KEY (`medID`),
  FOREIGN KEY (`patient_ref`) REFERENCES `patient`(`patient_ref`),
  FOREIGN KEY (`docsID`) REFERENCES `doctors`(`docsID`)
);

CREATE TABLE `reports` (
  `repID` INT NOT NULL AUTO_INCREMENT,
  `docID` INT NULL,
  `patient_ref` VARCHAR(500) NOT NULL,
  `report_title` VARCHAR(500) NOT NULL,
  `report` VARCHAR(500) NULL,
  `reportDate` TIMESTAMP NULL,
  PRIMARY KEY (`repID`),
  FOREIGN KEY (`patient_ref`) REFERENCES `patient`(`patient_ref`),
  FOREIGN KEY (`docID`) REFERENCES `doctors`(`docsID`)
);

CREATE TABLE `emergency` (
  `contact` VARCHAR(13) NULL,
  `ID` INT NOT NULL,
  PRIMARY KEY (`contact`),
  FOREIGN KEY (`ID`) REFERENCES `users`(`userID`)
);
