/*
  Warnings:

  - You are about to drop the `_CouncilTopic_relatedLegislativeTopic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_CouncilTopic_relatedLegislativeTopic` DROP FOREIGN KEY `_CouncilTopic_relatedLegislativeTopic_A_fkey`;

-- DropForeignKey
ALTER TABLE `_CouncilTopic_relatedLegislativeTopic` DROP FOREIGN KEY `_CouncilTopic_relatedLegislativeTopic_B_fkey`;

-- DropTable
DROP TABLE `_CouncilTopic_relatedLegislativeTopic`;

-- CreateTable
CREATE TABLE `_CouncilTopic_relatedLegislativeTopics` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CouncilTopic_relatedLegislativeTopics_AB_unique`(`A`, `B`),
    INDEX `_CouncilTopic_relatedLegislativeTopics_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CouncilTopic_relatedLegislativeTopics` ADD CONSTRAINT `_CouncilTopic_relatedLegislativeTopics_A_fkey` FOREIGN KEY (`A`) REFERENCES `CouncilTopic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouncilTopic_relatedLegislativeTopics` ADD CONSTRAINT `_CouncilTopic_relatedLegislativeTopics_B_fkey` FOREIGN KEY (`B`) REFERENCES `Topic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
