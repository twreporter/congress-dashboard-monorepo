/*
  Warnings:

  - You are about to drop the column `csvData` on the `ImportRecord` table. All the data in the column will be lost.
  - You are about to drop the column `listName` on the `ImportRecord` table. All the data in the column will be lost.
  - You are about to alter the column `summary` on the `Speech` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `content` on the `Speech` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - Added the required column `uploadData_csvData` to the `ImportRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadData_listName` to the `ImportRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ImportRecord` DROP COLUMN `csvData`,
    DROP COLUMN `listName`,
    ADD COLUMN `uploadData_csvData` JSON NOT NULL,
    ADD COLUMN `uploadData_listName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Speech` MODIFY `summary` JSON NULL,
    MODIFY `content` JSON NULL;
