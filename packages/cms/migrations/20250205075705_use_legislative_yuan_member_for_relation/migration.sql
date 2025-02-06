/*
  Warnings:

  - You are about to drop the column `legislator` on the `Speech` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Speech` DROP FOREIGN KEY `Speech_legislator_fkey`;

-- AlterTable
ALTER TABLE `Speech` DROP COLUMN `legislator`,
    ADD COLUMN `legislativeYuanMember` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Speech_legislativeYuanMember_idx` ON `Speech`(`legislativeYuanMember`);

-- AddForeignKey
ALTER TABLE `Speech` ADD CONSTRAINT `Speech_legislativeYuanMember_fkey` FOREIGN KEY (`legislativeYuanMember`) REFERENCES `LegislativeYuanMember`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
