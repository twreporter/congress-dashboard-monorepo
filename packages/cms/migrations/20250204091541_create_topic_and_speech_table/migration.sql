-- CreateTable
CREATE TABLE `Topic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL DEFAULT '',
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Topic_slug_key`(`slug`),
    INDEX `Topic_title_idx`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Speech` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `legislativeMeeting` INTEGER NULL,
    `legislativeMeetingSession` INTEGER NULL,
    `legislator` INTEGER NULL,
    `date` DATE NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT '',
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `summary` VARCHAR(191) NOT NULL DEFAULT '',
    `content` VARCHAR(191) NOT NULL DEFAULT '',
    `attendee` VARCHAR(191) NOT NULL DEFAULT '',
    `ivodLink` VARCHAR(191) NOT NULL DEFAULT '',
    `ivodStartTime` VARCHAR(191) NOT NULL DEFAULT '',
    `ivodEndTime` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Speech_slug_key`(`slug`),
    INDEX `Speech_legislativeMeeting_idx`(`legislativeMeeting`),
    INDEX `Speech_legislativeMeetingSession_idx`(`legislativeMeetingSession`),
    INDEX `Speech_legislator_idx`(`legislator`),
    INDEX `Speech_date_idx`(`date`),
    INDEX `Speech_title_idx`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_Speech_topics` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_Speech_topics_AB_unique`(`A`, `B`),
    INDEX `_Speech_topics_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Speech` ADD CONSTRAINT `Speech_legislativeMeeting_fkey` FOREIGN KEY (`legislativeMeeting`) REFERENCES `LegislativeMeeting`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Speech` ADD CONSTRAINT `Speech_legislativeMeetingSession_fkey` FOREIGN KEY (`legislativeMeetingSession`) REFERENCES `LegislativeMeetingSession`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Speech` ADD CONSTRAINT `Speech_legislator_fkey` FOREIGN KEY (`legislator`) REFERENCES `Legislator`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Speech_topics` ADD CONSTRAINT `_Speech_topics_A_fkey` FOREIGN KEY (`A`) REFERENCES `Speech`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Speech_topics` ADD CONSTRAINT `_Speech_topics_B_fkey` FOREIGN KEY (`B`) REFERENCES `Topic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
