-- AlterTable
ALTER TABLE `LegislativeMeetingSession` ADD COLUMN `labelForCMS` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `LegislativeYuanMember` ADD COLUMN `labelForCMS` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE `CommitteeMember` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `legislativeMeetingSession` INTEGER NULL,
    `legislativeYuanMember` INTEGER NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `CommitteeMember_legislativeMeetingSession_idx`(`legislativeMeetingSession`),
    INDEX `CommitteeMember_legislativeYuanMember_idx`(`legislativeYuanMember`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CommitteeMember_committee` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CommitteeMember_committee_AB_unique`(`A`, `B`),
    INDEX `_CommitteeMember_committee_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CommitteeMember` ADD CONSTRAINT `CommitteeMember_legislativeMeetingSession_fkey` FOREIGN KEY (`legislativeMeetingSession`) REFERENCES `LegislativeMeetingSession`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommitteeMember` ADD CONSTRAINT `CommitteeMember_legislativeYuanMember_fkey` FOREIGN KEY (`legislativeYuanMember`) REFERENCES `LegislativeYuanMember`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CommitteeMember_committee` ADD CONSTRAINT `_CommitteeMember_committee_A_fkey` FOREIGN KEY (`A`) REFERENCES `Committee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CommitteeMember_committee` ADD CONSTRAINT `_CommitteeMember_committee_B_fkey` FOREIGN KEY (`B`) REFERENCES `CommitteeMember`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
