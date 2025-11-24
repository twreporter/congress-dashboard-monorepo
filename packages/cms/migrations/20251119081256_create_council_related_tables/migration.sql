-- CreateTable
CREATE TABLE `Councilor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `image` INTEGER NULL,
    `imageLink` VARCHAR(191) NOT NULL DEFAULT '',
    `externalLink` VARCHAR(191) NOT NULL DEFAULT '',
    `meetingTermCount` INTEGER NULL,
    `meetingTermCountInfo` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Councilor_slug_key`(`slug`),
    INDEX `Councilor_image_idx`(`image`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CouncilMeeting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city` VARCHAR(191) NOT NULL,
    `term` INTEGER NOT NULL,
    `startTime` DATE NOT NULL,
    `endTime` DATE NOT NULL,
    `labelForCMS` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `CouncilMeeting_term_key`(`term`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CouncilMember` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `councilor` INTEGER NULL,
    `labelForCMS` VARCHAR(191) NOT NULL DEFAULT '',
    `party` INTEGER NULL,
    `councilMeeting` INTEGER NULL,
    `type` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NULL,
    `constituency` INTEGER NULL,
    `administrativeDistrict` JSON NULL,
    `tooltip` VARCHAR(191) NOT NULL DEFAULT '',
    `note` VARCHAR(191) NOT NULL DEFAULT '',
    `proposalSuccessCount` INTEGER NULL,
    `relatedLink` JSON NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `CouncilMember_councilor_idx`(`councilor`),
    INDEX `CouncilMember_party_idx`(`party`),
    INDEX `CouncilMember_councilMeeting_idx`(`councilMeeting`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CouncilTopic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL DEFAULT '',
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `city` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'general',
    `relatedTwreporterArticle` JSON NULL,
    `labelForCMS` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `CouncilTopic_slug_key`(`slug`),
    INDEX `CouncilTopic_title_idx`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CouncilBill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `councilMeeting` INTEGER NULL,
    `date` DATE NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT '',
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `summary` JSON NULL,
    `content` JSON NULL,
    `attendee` VARCHAR(191) NOT NULL DEFAULT '',
    `sourceLink` JSON NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `CouncilBill_slug_key`(`slug`),
    INDEX `CouncilBill_councilMeeting_idx`(`councilMeeting`),
    INDEX `CouncilBill_date_idx`(`date`),
    INDEX `CouncilBill_title_idx`(`title`),
    INDEX `CouncilBill_updatedAt_idx`(`updatedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CouncilTopic_relatedLegislativeTopic` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CouncilTopic_relatedLegislativeTopic_AB_unique`(`A`, `B`),
    INDEX `_CouncilTopic_relatedLegislativeTopic_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CouncilTopic_referencedByCouncilTopic` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CouncilTopic_referencedByCouncilTopic_AB_unique`(`A`, `B`),
    INDEX `_CouncilTopic_referencedByCouncilTopic_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CouncilTopic_referencedByCityCouncilTopic` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CouncilTopic_referencedByCityCouncilTopic_AB_unique`(`A`, `B`),
    INDEX `_CouncilTopic_referencedByCityCouncilTopic_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CouncilBill_councilMember` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CouncilBill_councilMember_AB_unique`(`A`, `B`),
    INDEX `_CouncilBill_councilMember_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CouncilBill_topic` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CouncilBill_topic_AB_unique`(`A`, `B`),
    INDEX `_CouncilBill_topic_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Councilor` ADD CONSTRAINT `Councilor_image_fkey` FOREIGN KEY (`image`) REFERENCES `Photo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CouncilMember` ADD CONSTRAINT `CouncilMember_councilor_fkey` FOREIGN KEY (`councilor`) REFERENCES `Councilor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CouncilMember` ADD CONSTRAINT `CouncilMember_party_fkey` FOREIGN KEY (`party`) REFERENCES `Party`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CouncilMember` ADD CONSTRAINT `CouncilMember_councilMeeting_fkey` FOREIGN KEY (`councilMeeting`) REFERENCES `CouncilMeeting`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CouncilBill` ADD CONSTRAINT `CouncilBill_councilMeeting_fkey` FOREIGN KEY (`councilMeeting`) REFERENCES `CouncilMeeting`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouncilTopic_relatedLegislativeTopic` ADD CONSTRAINT `_CouncilTopic_relatedLegislativeTopic_A_fkey` FOREIGN KEY (`A`) REFERENCES `CouncilTopic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouncilTopic_relatedLegislativeTopic` ADD CONSTRAINT `_CouncilTopic_relatedLegislativeTopic_B_fkey` FOREIGN KEY (`B`) REFERENCES `Topic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouncilTopic_referencedByCouncilTopic` ADD CONSTRAINT `_CouncilTopic_referencedByCouncilTopic_A_fkey` FOREIGN KEY (`A`) REFERENCES `CouncilTopic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouncilTopic_referencedByCouncilTopic` ADD CONSTRAINT `_CouncilTopic_referencedByCouncilTopic_B_fkey` FOREIGN KEY (`B`) REFERENCES `CouncilTopic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouncilTopic_referencedByCityCouncilTopic` ADD CONSTRAINT `_CouncilTopic_referencedByCityCouncilTopic_A_fkey` FOREIGN KEY (`A`) REFERENCES `CouncilTopic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouncilTopic_referencedByCityCouncilTopic` ADD CONSTRAINT `_CouncilTopic_referencedByCityCouncilTopic_B_fkey` FOREIGN KEY (`B`) REFERENCES `CouncilTopic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouncilBill_councilMember` ADD CONSTRAINT `_CouncilBill_councilMember_A_fkey` FOREIGN KEY (`A`) REFERENCES `CouncilBill`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouncilBill_councilMember` ADD CONSTRAINT `_CouncilBill_councilMember_B_fkey` FOREIGN KEY (`B`) REFERENCES `CouncilMember`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouncilBill_topic` ADD CONSTRAINT `_CouncilBill_topic_A_fkey` FOREIGN KEY (`A`) REFERENCES `CouncilBill`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouncilBill_topic` ADD CONSTRAINT `_CouncilBill_topic_B_fkey` FOREIGN KEY (`B`) REFERENCES `CouncilTopic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
