-- CreateTable
CREATE TABLE `SystemUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `SystemUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Photo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `imageFile_id` VARCHAR(191) NULL,
    `imageFile_filesize` INTEGER NULL,
    `imageFile_width` INTEGER NULL,
    `imageFile_height` INTEGER NULL,
    `imageFile_extension` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `Photo_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Party` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `image` INTEGER NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Party_slug_key`(`slug`),
    INDEX `Party_image_idx`(`image`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Party` ADD CONSTRAINT `Party_image_fkey` FOREIGN KEY (`image`) REFERENCES `Photo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
