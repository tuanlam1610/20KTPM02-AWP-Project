/*
  Warnings:

  - Made the column `name` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "classOwnerId" TEXT;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "name" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_classOwnerId_fkey" FOREIGN KEY ("classOwnerId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
