-- CreateTable
CREATE TABLE `MemberFollowingTopicLegislator` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member` INTEGER NOT NULL,
    `topic` INTEGER NOT NULL,
    `legislator` INTEGER NOT NULL,
    `legislativeMeeting` INTEGER NOT NULL,
    `allSessions` BOOLEAN NOT NULL DEFAULT true,
    `source` VARCHAR(191) NOT NULL DEFAULT 'topic',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MemberFollowingTopicLegislator_member_idx`(`member`),
    INDEX `MemberFollowingTopicLegislator_topic_idx`(`topic`),
    INDEX `MemberFollowingTopicLegislator_legislator_idx`(`legislator`),
    INDEX `MemberFollowingTopicLegislator_legislativeMeeting_idx`(`legislativeMeeting`),
    UNIQUE INDEX `MemberFollowingTopicLegislator_member_topic_legislator_legis_key`(`member`, `topic`, `legislator`, `legislativeMeeting`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemberFollowingCouncilTopicCouncilor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member` INTEGER NOT NULL,
    `councilTopic` INTEGER NOT NULL,
    `councilor` INTEGER NOT NULL,
    `councilMeeting` INTEGER NOT NULL,
    `source` VARCHAR(191) NOT NULL DEFAULT 'topic',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MemberFollowingCouncilTopicCouncilor_member_idx`(`member`),
    INDEX `MemberFollowingCouncilTopicCouncilor_councilTopic_idx`(`councilTopic`),
    INDEX `MemberFollowingCouncilTopicCouncilor_councilor_idx`(`councilor`),
    INDEX `MemberFollowingCouncilTopicCouncilor_councilMeeting_idx`(`councilMeeting`),
    UNIQUE INDEX `MemberFollowingCouncilTopicCouncilor_member_councilTopic_cou_key`(`member`, `councilTopic`, `councilor`, `councilMeeting`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MemberFollowingTopicLegislator_sessions` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MemberFollowingTopicLegislator_sessions_AB_unique`(`A`, `B`),
    INDEX `_MemberFollowingTopicLegislator_sessions_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MemberFollowingTopicLegislator` ADD CONSTRAINT `MemberFollowingTopicLegislator_member_fkey` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFollowingTopicLegislator` ADD CONSTRAINT `MemberFollowingTopicLegislator_topic_fkey` FOREIGN KEY (`topic`) REFERENCES `Topic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFollowingTopicLegislator` ADD CONSTRAINT `MemberFollowingTopicLegislator_legislator_fkey` FOREIGN KEY (`legislator`) REFERENCES `Legislator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFollowingTopicLegislator` ADD CONSTRAINT `MemberFollowingTopicLegislator_legislativeMeeting_fkey` FOREIGN KEY (`legislativeMeeting`) REFERENCES `LegislativeMeeting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `MemberFollowingCouncilTopicCouncilor` ADD CONSTRAINT `MemberFollowingCouncilTopicCouncilor_member_fkey` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFollowingCouncilTopicCouncilor` ADD CONSTRAINT `MemberFollowingCouncilTopicCouncilor_councilTopic_fkey` FOREIGN KEY (`councilTopic`) REFERENCES `CouncilTopic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFollowingCouncilTopicCouncilor` ADD CONSTRAINT `MemberFollowingCouncilTopicCouncilor_councilor_fkey` FOREIGN KEY (`councilor`) REFERENCES `Councilor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFollowingCouncilTopicCouncilor` ADD CONSTRAINT `MemberFollowingCouncilTopicCouncilor_councilMeeting_fkey` FOREIGN KEY (`councilMeeting`) REFERENCES `CouncilMeeting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `_MemberFollowingTopicLegislator_sessions` ADD CONSTRAINT `_MemberFollowingTopicLegislator_sessions_A_fkey` FOREIGN KEY (`A`) REFERENCES `LegislativeMeetingSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `_MemberFollowingTopicLegislator_sessions` ADD CONSTRAINT `_MemberFollowingTopicLegislator_sessions_B_fkey` FOREIGN KEY (`B`) REFERENCES `MemberFollowingTopicLegislator`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
