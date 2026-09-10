-- CreateTable
CREATE TABLE `CouncilSpeech` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `councilMeeting` INTEGER NULL,
    `councilMember` INTEGER NULL,
    `date` DATE NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT '',
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `summary` JSON NULL,
    `content` JSON NULL,
    `attendee` VARCHAR(191) NOT NULL DEFAULT '',
    `sourceLink` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `CouncilSpeech_slug_key`(`slug`),
    INDEX `CouncilSpeech_councilMeeting_idx`(`councilMeeting`),
    INDEX `CouncilSpeech_councilMember_idx`(`councilMember`),
    INDEX `CouncilSpeech_date_idx`(`date`),
    INDEX `CouncilSpeech_title_idx`(`title`),
    INDEX `CouncilSpeech_updatedAt_idx`(`updatedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CouncilSpeech_topic` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CouncilSpeech_topic_AB_unique`(`A`, `B`),
    INDEX `_CouncilSpeech_topic_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CouncilSpeech` ADD CONSTRAINT `CouncilSpeech_councilMeeting_fkey` FOREIGN KEY (`councilMeeting`) REFERENCES `CouncilMeeting`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CouncilSpeech` ADD CONSTRAINT `CouncilSpeech_councilMember_fkey` FOREIGN KEY (`councilMember`) REFERENCES `CouncilMember`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouncilSpeech_topic` ADD CONSTRAINT `_CouncilSpeech_topic_A_fkey` FOREIGN KEY (`A`) REFERENCES `CouncilSpeech`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouncilSpeech_topic` ADD CONSTRAINT `_CouncilSpeech_topic_B_fkey` FOREIGN KEY (`B`) REFERENCES `CouncilTopic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
