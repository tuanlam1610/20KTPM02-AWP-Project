/*
  Warnings:

  - The primary key for the `GradeReview` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_gradeReviewId_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "gradeReviewId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "GradeReview" DROP CONSTRAINT "GradeReview_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "GradeReview_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "GradeReview_id_seq";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_gradeReviewId_fkey" FOREIGN KEY ("gradeReviewId") REFERENCES "GradeReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
