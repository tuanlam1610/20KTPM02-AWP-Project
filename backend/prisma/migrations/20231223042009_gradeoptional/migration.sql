-- AlterTable
ALTER TABLE "ClassMember" ALTER COLUMN "totalGrade" DROP NOT NULL,
ALTER COLUMN "totalGrade" DROP DEFAULT;

-- AlterTable
ALTER TABLE "StudentGrade" ALTER COLUMN "grade" DROP NOT NULL;
