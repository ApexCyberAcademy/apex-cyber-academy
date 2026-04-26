CREATE TABLE `lab_completions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lectureId` int NOT NULL,
	`courseId` int NOT NULL,
	`score` int,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lab_completions_id` PRIMARY KEY(`id`)
);
