-- CreateTable
CREATE TABLE `LegislativeMeeting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `term` INTEGER NOT NULL,
    `startTime` DATE NOT NULL,
    `endTime` DATE NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
