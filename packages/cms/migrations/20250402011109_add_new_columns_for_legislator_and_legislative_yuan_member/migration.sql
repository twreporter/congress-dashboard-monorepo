-- AlterTable
ALTER TABLE `LegislativeYuanMember` ADD COLUMN `proposalSuccessCount` INTEGER NULL;

-- AlterTable
ALTER TABLE `Legislator` ADD COLUMN `externalLink` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `meetingTermCount` INTEGER NULL,
    ADD COLUMN `meetingTermCountInfo` VARCHAR(191) NOT NULL DEFAULT '';
