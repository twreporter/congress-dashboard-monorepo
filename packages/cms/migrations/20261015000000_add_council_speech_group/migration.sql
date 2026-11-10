ALTER TABLE `CouncilSpeech`
  ADD COLUMN `speechGroup` VARCHAR(191) NOT NULL DEFAULT '',
  ADD COLUMN `speechOrder` INTEGER NOT NULL DEFAULT 0;

CREATE INDEX `CouncilSpeech_speechGroup_idx` ON `CouncilSpeech`(`speechGroup`);
