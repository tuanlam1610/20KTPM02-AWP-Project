/*
  Warnings:

  - The values [OPEN,APPROVED,DENIED] on the enum `GradeReviewStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GradeReviewStatus_new" AS ENUM ('open', 'approved', 'denied');
ALTER TABLE "GradeReview" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "GradeReview" ALTER COLUMN "status" TYPE "GradeReviewStatus_new" USING ("status"::text::"GradeReviewStatus_new");
ALTER TYPE "GradeReviewStatus" RENAME TO "GradeReviewStatus_old";
ALTER TYPE "GradeReviewStatus_new" RENAME TO "GradeReviewStatus";
DROP TYPE "GradeReviewStatus_old";
ALTER TABLE "GradeReview" ALTER COLUMN "status" SET DEFAULT 'open';
COMMIT;

-- AlterTable
ALTER TABLE "GradeReview" ALTER COLUMN "status" SET DEFAULT 'open';
