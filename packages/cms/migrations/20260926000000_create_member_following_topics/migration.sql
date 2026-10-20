-- CreateTable
CREATE TABLE `MemberFollowingTopic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member` INTEGER NOT NULL,
    `topic` INTEGER NOT NULL,
    `legislativeMeeting` INTEGER NOT NULL,
    `allSessions` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MemberFollowingTopic_member_idx`(`member`),
    INDEX `MemberFollowingTopic_topic_idx`(`topic`),
    INDEX `MemberFollowingTopic_legislativeMeeting_idx`(`legislativeMeeting`),
    UNIQUE INDEX `MemberFollowingTopic_member_topic_legislativeMeeting_key`(`member`, `topic`, `legislativeMeeting`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemberFollowingCouncilTopic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member` INTEGER NOT NULL,
    `councilTopic` INTEGER NOT NULL,
    `councilMeeting` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MemberFollowingCouncilTopic_member_idx`(`member`),
    INDEX `MemberFollowingCouncilTopic_councilTopic_idx`(`councilTopic`),
    INDEX `MemberFollowingCouncilTopic_councilMeeting_idx`(`councilMeeting`),
    UNIQUE INDEX `MemberFollowingCouncilTopic_member_councilTopic_councilMeeti_key`(`member`, `councilTopic`, `councilMeeting`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MemberFollowingTopic_sessions` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MemberFollowingTopic_sessions_AB_unique`(`A`, `B`),
    INDEX `_MemberFollowingTopic_sessions_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MemberFollowingTopic` ADD CONSTRAINT `MemberFollowingTopic_member_fkey` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFollowingTopic` ADD CONSTRAINT `MemberFollowingTopic_topic_fkey` FOREIGN KEY (`topic`) REFERENCES `Topic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFollowingTopic` ADD CONSTRAINT `MemberFollowingTopic_legislativeMeeting_fkey` FOREIGN KEY (`legislativeMeeting`) REFERENCES `LegislativeMeeting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `MemberFollowingCouncilTopic` ADD CONSTRAINT `MemberFollowingCouncilTopic_member_fkey` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFollowingCouncilTopic` ADD CONSTRAINT `MemberFollowingCouncilTopic_councilTopic_fkey` FOREIGN KEY (`councilTopic`) REFERENCES `CouncilTopic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFollowingCouncilTopic` ADD CONSTRAINT `MemberFollowingCouncilTopic_councilMeeting_fkey` FOREIGN KEY (`councilMeeting`) REFERENCES `CouncilMeeting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `_MemberFollowingTopic_sessions` ADD CONSTRAINT `_MemberFollowingTopic_sessions_A_fkey` FOREIGN KEY (`A`) REFERENCES `LegislativeMeetingSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `_MemberFollowingTopic_sessions` ADD CONSTRAINT `_MemberFollowingTopic_sessions_B_fkey` FOREIGN KEY (`B`) REFERENCES `MemberFollowingTopic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
