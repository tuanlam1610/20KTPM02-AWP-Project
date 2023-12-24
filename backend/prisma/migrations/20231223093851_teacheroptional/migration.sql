-- DropForeignKey
ALTER TABLE "GradeReview" DROP CONSTRAINT "GradeReview_teacherId_fkey";

-- AlterTable
ALTER TABLE "GradeReview" ALTER COLUMN "teacherId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "GradeReview" ADD CONSTRAINT "GradeReview_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
