-- CreateTable
CREATE TABLE `ImportRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recordName` VARCHAR(191) NOT NULL DEFAULT '',
    `listName` VARCHAR(191) NOT NULL,
    `csvData` JSON NULL,
    `importer` INTEGER NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `ImportRecord_importer_idx`(`importer`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ImportRecord` ADD CONSTRAINT `ImportRecord_importer_fkey` FOREIGN KEY (`importer`) REFERENCES `SystemUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
