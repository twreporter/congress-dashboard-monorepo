/*
  Warnings:

  - Made the column `city` on table `CouncilMember` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `CouncilMeeting_term_key` ON `CouncilMeeting`;

-- AlterTable
ALTER TABLE `CouncilMember` MODIFY `city` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `CouncilImportRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recordName` VARCHAR(191) NOT NULL DEFAULT '',
    `uploadData_listName` VARCHAR(191) NULL,
    `uploadData_filename` VARCHAR(191) NULL,
    `uploadData_filesize` INTEGER NULL,
    `uploadData_url` VARCHAR(191) NULL,
    `recordCount` INTEGER NULL,
    `importer` INTEGER NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `CouncilImportRecord_importer_idx`(`importer`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `CouncilMeeting_term_idx` ON `CouncilMeeting`(`term`);

-- CreateIndex
CREATE INDEX `CouncilMember_type_idx` ON `CouncilMember`(`type`);

-- CreateIndex
CREATE INDEX `CouncilMember_city_idx` ON `CouncilMember`(`city`);

-- AddForeignKey
ALTER TABLE `CouncilImportRecord` ADD CONSTRAINT `CouncilImportRecord_importer_fkey` FOREIGN KEY (`importer`) REFERENCES `SystemUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
