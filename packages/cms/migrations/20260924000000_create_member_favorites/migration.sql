-- CreateTable
CREATE TABLE `MemberFavoriteCouncilMember` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member` INTEGER NOT NULL,
    `councilMember` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MemberFavoriteCouncilMember_member_councilMember_key`(`member`, `councilMember`),
    INDEX `MemberFavoriteCouncilMember_member_idx`(`member`),
    INDEX `MemberFavoriteCouncilMember_councilMember_idx`(`councilMember`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemberFavoriteLegislativeYuanMember` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member` INTEGER NOT NULL,
    `legislativeYuanMember` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MemberFavoriteLegislativeYuanMember_member_legislativeYuanMe_key`(`member`, `legislativeYuanMember`),
    INDEX `MemberFavoriteLegislativeYuanMember_member_idx`(`member`),
    INDEX `MemberFavoriteLegislativeYuanMember_legislativeYuanMember_idx`(`legislativeYuanMember`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemberFavoriteSpeech` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member` INTEGER NOT NULL,
    `speech` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MemberFavoriteSpeech_member_speech_key`(`member`, `speech`),
    INDEX `MemberFavoriteSpeech_member_idx`(`member`),
    INDEX `MemberFavoriteSpeech_speech_idx`(`speech`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemberFavoriteCouncilSpeech` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member` INTEGER NOT NULL,
    `councilSpeech` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MemberFavoriteCouncilSpeech_member_councilSpeech_key`(`member`, `councilSpeech`),
    INDEX `MemberFavoriteCouncilSpeech_member_idx`(`member`),
    INDEX `MemberFavoriteCouncilSpeech_councilSpeech_idx`(`councilSpeech`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemberFavoriteCouncilBill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member` INTEGER NOT NULL,
    `councilBill` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MemberFavoriteCouncilBill_member_councilBill_key`(`member`, `councilBill`),
    INDEX `MemberFavoriteCouncilBill_member_idx`(`member`),
    INDEX `MemberFavoriteCouncilBill_councilBill_idx`(`councilBill`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MemberFavoriteCouncilMember` ADD CONSTRAINT `MemberFavoriteCouncilMember_member_fkey` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFavoriteCouncilMember` ADD CONSTRAINT `MemberFavoriteCouncilMember_councilMember_fkey` FOREIGN KEY (`councilMember`) REFERENCES `CouncilMember`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `MemberFavoriteLegislativeYuanMember` ADD CONSTRAINT `MemberFavoriteLegislativeYuanMember_member_fkey` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFavoriteLegislativeYuanMember` ADD CONSTRAINT `MemberFavoriteLegislativeYuanMember_legislativeYuanMember_fkey` FOREIGN KEY (`legislativeYuanMember`) REFERENCES `LegislativeYuanMember`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `MemberFavoriteSpeech` ADD CONSTRAINT `MemberFavoriteSpeech_member_fkey` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFavoriteSpeech` ADD CONSTRAINT `MemberFavoriteSpeech_speech_fkey` FOREIGN KEY (`speech`) REFERENCES `Speech`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `MemberFavoriteCouncilSpeech` ADD CONSTRAINT `MemberFavoriteCouncilSpeech_member_fkey` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFavoriteCouncilSpeech` ADD CONSTRAINT `MemberFavoriteCouncilSpeech_councilSpeech_fkey` FOREIGN KEY (`councilSpeech`) REFERENCES `CouncilSpeech`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `MemberFavoriteCouncilBill` ADD CONSTRAINT `MemberFavoriteCouncilBill_member_fkey` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `MemberFavoriteCouncilBill` ADD CONSTRAINT `MemberFavoriteCouncilBill_councilBill_fkey` FOREIGN KEY (`councilBill`) REFERENCES `CouncilBill`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
