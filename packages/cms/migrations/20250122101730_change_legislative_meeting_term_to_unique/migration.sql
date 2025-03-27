/*
  Warnings:

  - A unique constraint covering the columns `[term]` on the table `LegislativeMeeting` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `LegislativeMeeting_term_key` ON `LegislativeMeeting`(`term`);
