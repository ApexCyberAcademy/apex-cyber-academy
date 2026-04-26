CREATE TABLE `badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int,
	`badgeType` enum('course_complete','perfect_score','speed_demon','all_lectures','quiz_master','honor_roll') NOT NULL,
	`title` varchar(100) NOT NULL,
	`description` varchar(500),
	`iconEmoji` varchar(10) NOT NULL,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`quizAttemptId` int NOT NULL,
	`certificateNumber` varchar(50) NOT NULL,
	`studentName` varchar(255) NOT NULL,
	`courseTitle` varchar(255) NOT NULL,
	`certCode` varchar(50),
	`score` int NOT NULL,
	`pdfUrl` varchar(500),
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `certificates_certificateNumber_unique` UNIQUE(`certificateNumber`)
);
