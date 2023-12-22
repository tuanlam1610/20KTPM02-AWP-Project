/*
  Warnings:

  - A unique constraint covering the columns `[gradeCompositionId,studentId]` on the table `StudentGrade` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StudentGrade_gradeCompositionId_studentId_key" ON "StudentGrade"("gradeCompositionId", "studentId");
