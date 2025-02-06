-- CreateTable
CREATE TABLE `Selected` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `legislator` INTEGER NULL,
    `topic` INTEGER NULL,
    `order` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `Selected_legislator_idx`(`legislator`),
    INDEX `Selected_topic_idx`(`topic`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Selected` ADD CONSTRAINT `Selected_legislator_fkey` FOREIGN KEY (`legislator`) REFERENCES `Legislator`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Selected` ADD CONSTRAINT `Selected_topic_fkey` FOREIGN KEY (`topic`) REFERENCES `Topic`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
