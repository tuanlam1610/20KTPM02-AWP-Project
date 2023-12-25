/*
  Warnings:

  - Added the required column `classId` to the `GradeReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GradeReview" ADD COLUMN     "classId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GradeReview" ADD CONSTRAINT "GradeReview_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
