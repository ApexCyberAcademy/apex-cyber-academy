CREATE TABLE `slide_downloads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lectureId` int NOT NULL,
	`courseId` int NOT NULL,
	`downloadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `slide_downloads_id` PRIMARY KEY(`id`)
);
