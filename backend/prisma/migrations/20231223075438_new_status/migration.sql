-- CreateEnum
CREATE TYPE "GradeReviewStatus" AS ENUM ('OPEN', 'APPROVED', 'DENIED');

-- AlterTable
ALTER TABLE "GradeReview" ADD COLUMN     "status" "GradeReviewStatus" NOT NULL DEFAULT 'OPEN';
