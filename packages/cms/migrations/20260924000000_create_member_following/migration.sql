-- CreateTable
CREATE TABLE `MemberFollowingCouncilMember` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member` INTEGER NOT NULL,
    `councilMember` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MemberFollowingCouncilMember_member_councilMember_key`(`member`, `councilMember`),
    INDEX `MemberFollowingCouncilMember_member_idx`(`member`),
    INDEX `MemberFollowingCouncilMember_councilMember_idx`(`councilMember`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemberFollowingLegislativeYuanMember` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member` INTEGER NOT NULL,
    `legislativeYuanMember` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MemberFollowingLegislativeYuanMember_member_legislativeYuanM_key`(`member`, `legislativeYuanMember`),
    INDEX `MemberFollowingLegislativeYuanMember_member_idx`(`member`),
    INDEX `MemberFollowingLegislativeYuanMember_legislativeYuanMember_idx`(`legislativeYuanMember`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemberFollowingSpeech` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member` INTEGER NOT NULL,
    `speech` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MemberFollowingSpeech_member_speech_key`(`member`, `speech`),
    INDEX `MemberFollowingSpeech_member_idx`(`member`),
    INDEX `MemberFollowingSpeech_speech_idx`(`speech`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemberFollowingCouncilSpeech` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member` INTEGER NOT NULL,
    `councilSpeech` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MemberFollowingCouncilSpeech_member_councilSpeech_key`(`member`, `councilSpeech`),
    INDEX `MemberFollowingCouncilSpeech_member_idx`(`member`),
    INDEX `MemberFollowingCouncilSpeech_councilSpeech_idx`(`councilSpeech`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemberFollowingCouncilBill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member` INTEGER NOT NULL,
    `councilBill` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MemberFollowingCouncilBill_member_councilBill_key`(`member`, `councilBill`),
    INDEX `MemberFollowingCouncilBill_member_idx`(`member`),
    INDEX `MemberFollowingCouncilBill_councilBill_idx`(`councilBill`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MemberFollowingCouncilMember` ADD CONSTRAINT `MemberFollowingCouncilMember_member_fkey` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFollowingCouncilMember` ADD CONSTRAINT `MemberFollowingCouncilMember_councilMember_fkey` FOREIGN KEY (`councilMember`) REFERENCES `CouncilMember`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `MemberFollowingLegislativeYuanMember` ADD CONSTRAINT `MemberFollowingLegislativeYuanMember_member_fkey` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFollowingLegislativeYuanMember` ADD CONSTRAINT `MemberFollowingLegislativeYuanMember_legislativeYuanMember_fkey` FOREIGN KEY (`legislativeYuanMember`) REFERENCES `LegislativeYuanMember`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `MemberFollowingSpeech` ADD CONSTRAINT `MemberFollowingSpeech_member_fkey` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFollowingSpeech` ADD CONSTRAINT `MemberFollowingSpeech_speech_fkey` FOREIGN KEY (`speech`) REFERENCES `Speech`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `MemberFollowingCouncilSpeech` ADD CONSTRAINT `MemberFollowingCouncilSpeech_member_fkey` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFollowingCouncilSpeech` ADD CONSTRAINT `MemberFollowingCouncilSpeech_councilSpeech_fkey` FOREIGN KEY (`councilSpeech`) REFERENCES `CouncilSpeech`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `MemberFollowingCouncilBill` ADD CONSTRAINT `MemberFollowingCouncilBill_member_fkey` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFollowingCouncilBill` ADD CONSTRAINT `MemberFollowingCouncilBill_councilBill_fkey` FOREIGN KEY (`councilBill`) REFERENCES `CouncilBill`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
