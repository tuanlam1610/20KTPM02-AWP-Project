/*
  Warnings:

  - Made the column `code` on table `Class` required. This step will fail if there are existing NULL values in that column.
  - Made the column `invitationLink` on table `Class` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Class" ALTER COLUMN "code" SET NOT NULL,
ALTER COLUMN "invitationLink" SET NOT NULL;
