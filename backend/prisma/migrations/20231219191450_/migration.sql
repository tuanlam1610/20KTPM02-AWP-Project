/*
  Warnings:

  - A unique constraint covering the columns `[studentGradeId]` on the table `GradeReview` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GradeReview_studentGradeId_key" ON "GradeReview"("studentGradeId");
