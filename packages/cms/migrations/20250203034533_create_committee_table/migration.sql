-- CreateTable
CREATE TABLE `Committee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `type` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Committee_slug_key`(`slug`),
    INDEX `Committee_name_idx`(`name`),
    INDEX `Committee_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LegislativeMeeting_committees` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_LegislativeMeeting_committees_AB_unique`(`A`, `B`),
    INDEX `_LegislativeMeeting_committees_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_LegislativeMeeting_committees` ADD CONSTRAINT `_LegislativeMeeting_committees_A_fkey` FOREIGN KEY (`A`) REFERENCES `Committee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LegislativeMeeting_committees` ADD CONSTRAINT `_LegislativeMeeting_committees_B_fkey` FOREIGN KEY (`B`) REFERENCES `LegislativeMeeting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
