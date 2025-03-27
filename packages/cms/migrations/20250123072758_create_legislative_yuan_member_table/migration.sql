-- CreateTable
CREATE TABLE `LegislativeYuanMember` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `legislator` INTEGER NULL,
    `party` INTEGER NULL,
    `legislativeMeeting` INTEGER NULL,
    `type` VARCHAR(191) NOT NULL,
    `constituency` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `tooltip` VARCHAR(191) NOT NULL DEFAULT '',
    `note` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `LegislativeYuanMember_legislator_idx`(`legislator`),
    INDEX `LegislativeYuanMember_party_idx`(`party`),
    INDEX `LegislativeYuanMember_legislativeMeeting_idx`(`legislativeMeeting`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LegislativeYuanMember` ADD CONSTRAINT `LegislativeYuanMember_legislator_fkey` FOREIGN KEY (`legislator`) REFERENCES `Legislator`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LegislativeYuanMember` ADD CONSTRAINT `LegislativeYuanMember_party_fkey` FOREIGN KEY (`party`) REFERENCES `Party`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LegislativeYuanMember` ADD CONSTRAINT `LegislativeYuanMember_legislativeMeeting_fkey` FOREIGN KEY (`legislativeMeeting`) REFERENCES `LegislativeMeeting`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
