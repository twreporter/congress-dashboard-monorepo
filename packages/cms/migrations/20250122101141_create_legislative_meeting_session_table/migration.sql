-- CreateTable
CREATE TABLE `LegislativeMeetingSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `legislativeMeeting` INTEGER NULL,
    `term` INTEGER NOT NULL,
    `startTime` DATE NOT NULL,
    `endTime` DATE NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `LegislativeMeetingSession_legislativeMeeting_idx`(`legislativeMeeting`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LegislativeMeetingSession` ADD CONSTRAINT `LegislativeMeetingSession_legislativeMeeting_fkey` FOREIGN KEY (`legislativeMeeting`) REFERENCES `LegislativeMeeting`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
