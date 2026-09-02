-- CreateTable
CREATE TABLE `_CouncilMember_speech` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CouncilMember_speech_AB_unique`(`A`, `B`),
    INDEX `_CouncilMember_speech_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Preserve existing CouncilSpeech-to-CouncilMember relations
INSERT INTO `_CouncilMember_speech` (`A`, `B`)
SELECT `councilMember`, `id`
FROM `CouncilSpeech`
WHERE `councilMember` IS NOT NULL;

-- DropForeignKey
ALTER TABLE `CouncilSpeech` DROP FOREIGN KEY `CouncilSpeech_councilMember_fkey`;

-- DropIndex
DROP INDEX `CouncilSpeech_councilMember_idx` ON `CouncilSpeech`;

-- AlterTable
ALTER TABLE `CouncilSpeech` DROP COLUMN `councilMember`;

-- AddForeignKey
ALTER TABLE `_CouncilMember_speech` ADD CONSTRAINT `_CouncilMember_speech_A_fkey` FOREIGN KEY (`A`) REFERENCES `CouncilMember`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouncilMember_speech` ADD CONSTRAINT `_CouncilMember_speech_B_fkey` FOREIGN KEY (`B`) REFERENCES `CouncilSpeech`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
