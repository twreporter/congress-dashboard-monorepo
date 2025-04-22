/*
  Warnings:

  - You are about to drop the `_Topic_beenRelatedTopics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_Topic_beenRelatedTopics` DROP FOREIGN KEY `_Topic_beenRelatedTopics_A_fkey`;

-- DropForeignKey
ALTER TABLE `_Topic_beenRelatedTopics` DROP FOREIGN KEY `_Topic_beenRelatedTopics_B_fkey`;

-- DropTable
DROP TABLE `_Topic_beenRelatedTopics`;

-- CreateTable
CREATE TABLE `_Topic_referencedByTopics` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_Topic_referencedByTopics_AB_unique`(`A`, `B`),
    INDEX `_Topic_referencedByTopics_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_Topic_referencedByTopics` ADD CONSTRAINT `_Topic_referencedByTopics_A_fkey` FOREIGN KEY (`A`) REFERENCES `Topic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Topic_referencedByTopics` ADD CONSTRAINT `_Topic_referencedByTopics_B_fkey` FOREIGN KEY (`B`) REFERENCES `Topic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
