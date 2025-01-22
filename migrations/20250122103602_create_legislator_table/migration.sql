-- CreateTable
CREATE TABLE `Legislator` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `image` INTEGER NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Legislator_slug_key`(`slug`),
    INDEX `Legislator_image_idx`(`image`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Legislator` ADD CONSTRAINT `Legislator_image_fkey` FOREIGN KEY (`image`) REFERENCES `Photo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
