-- CreateTable
CREATE TABLE `MemberFavoriteTopicLegislator` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member` INTEGER NOT NULL,
    `topic` INTEGER NOT NULL,
    `legislator` INTEGER NOT NULL,
    `legislativeMeeting` INTEGER NOT NULL,
    `source` VARCHAR(191) NOT NULL DEFAULT 'topic',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MemberFavoriteTopicLegislator_member_idx`(`member`),
    INDEX `MemberFavoriteTopicLegislator_topic_idx`(`topic`),
    INDEX `MemberFavoriteTopicLegislator_legislator_idx`(`legislator`),
    INDEX `MemberFavoriteTopicLegislator_legislativeMeeting_idx`(`legislativeMeeting`),
    UNIQUE INDEX `MemberFavoriteTopicLegislator_member_topic_legislator_legisl_key`(`member`, `topic`, `legislator`, `legislativeMeeting`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemberFavoriteCouncilTopicCouncilor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member` INTEGER NOT NULL,
    `councilTopic` INTEGER NOT NULL,
    `councilor` INTEGER NOT NULL,
    `councilMeeting` INTEGER NOT NULL,
    `source` VARCHAR(191) NOT NULL DEFAULT 'topic',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MemberFavoriteCouncilTopicCouncilor_member_idx`(`member`),
    INDEX `MemberFavoriteCouncilTopicCouncilor_councilTopic_idx`(`councilTopic`),
    INDEX `MemberFavoriteCouncilTopicCouncilor_councilor_idx`(`councilor`),
    INDEX `MemberFavoriteCouncilTopicCouncilor_councilMeeting_idx`(`councilMeeting`),
    UNIQUE INDEX `MemberFavoriteCouncilTopicCouncilor_member_councilTopic_coun_key`(`member`, `councilTopic`, `councilor`, `councilMeeting`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MemberFavoriteTopicLegislator` ADD CONSTRAINT `MemberFavoriteTopicLegislator_member_fkey` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFavoriteTopicLegislator` ADD CONSTRAINT `MemberFavoriteTopicLegislator_topic_fkey` FOREIGN KEY (`topic`) REFERENCES `Topic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFavoriteTopicLegislator` ADD CONSTRAINT `MemberFavoriteTopicLegislator_legislator_fkey` FOREIGN KEY (`legislator`) REFERENCES `Legislator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFavoriteTopicLegislator` ADD CONSTRAINT `MemberFavoriteTopicLegislator_legislativeMeeting_fkey` FOREIGN KEY (`legislativeMeeting`) REFERENCES `LegislativeMeeting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `MemberFavoriteCouncilTopicCouncilor` ADD CONSTRAINT `MemberFavoriteCouncilTopicCouncilor_member_fkey` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFavoriteCouncilTopicCouncilor` ADD CONSTRAINT `MemberFavoriteCouncilTopicCouncilor_councilTopic_fkey` FOREIGN KEY (`councilTopic`) REFERENCES `CouncilTopic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFavoriteCouncilTopicCouncilor` ADD CONSTRAINT `MemberFavoriteCouncilTopicCouncilor_councilor_fkey` FOREIGN KEY (`councilor`) REFERENCES `Councilor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFavoriteCouncilTopicCouncilor` ADD CONSTRAINT `MemberFavoriteCouncilTopicCouncilor_councilMeeting_fkey` FOREIGN KEY (`councilMeeting`) REFERENCES `CouncilMeeting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
