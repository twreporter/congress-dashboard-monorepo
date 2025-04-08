-- CreateTable
CREATE TABLE `_Topic_beenRelatedTopics` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_Topic_beenRelatedTopics_AB_unique`(`A`, `B`),
    INDEX `_Topic_beenRelatedTopics_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_Topic_beenRelatedTopics` ADD CONSTRAINT `_Topic_beenRelatedTopics_A_fkey` FOREIGN KEY (`A`) REFERENCES `Topic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Topic_beenRelatedTopics` ADD CONSTRAINT `_Topic_beenRelatedTopics_B_fkey` FOREIGN KEY (`B`) REFERENCES `Topic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
