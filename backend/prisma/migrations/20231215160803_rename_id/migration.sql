/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `adminId` on the `Admin` table. All the data in the column will be lost.
  - The primary key for the `Class` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `classId` on the `Class` table. All the data in the column will be lost.
  - The primary key for the `ClassInvitationForStudent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ClassInvitationForTeacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ClassMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ClassTeacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `commentId` on the `Comment` table. All the data in the column will be lost.
  - The primary key for the `GradeComposition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `gradeCompositionId` on the `GradeComposition` table. All the data in the column will be lost.
  - The primary key for the `GradeReview` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `gradeReviewId` on the `GradeReview` table. All the data in the column will be lost.
  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `studentId` on the `Student` table. All the data in the column will be lost.
  - The primary key for the `StudentGrade` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `studentGradeId` on the `StudentGrade` table. All the data in the column will be lost.
  - The primary key for the `Teacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `teacherId` on the `Teacher` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - The required column `id` was added to the `Admin` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Class` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Comment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `GradeComposition` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Student` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `StudentGrade` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Teacher` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_userId_fkey";

-- DropForeignKey
ALTER TABLE "ClassInvitationForStudent" DROP CONSTRAINT "ClassInvitationForStudent_classId_fkey";

-- DropForeignKey
ALTER TABLE "ClassInvitationForStudent" DROP CONSTRAINT "ClassInvitationForStudent_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ClassInvitationForTeacher" DROP CONSTRAINT "ClassInvitationForTeacher_classId_fkey";

-- DropForeignKey
ALTER TABLE "ClassInvitationForTeacher" DROP CONSTRAINT "ClassInvitationForTeacher_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "ClassMember" DROP CONSTRAINT "ClassMember_classId_fkey";

-- DropForeignKey
ALTER TABLE "ClassMember" DROP CONSTRAINT "ClassMember_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ClassTeacher" DROP CONSTRAINT "ClassTeacher_classId_fkey";

-- DropForeignKey
ALTER TABLE "ClassTeacher" DROP CONSTRAINT "ClassTeacher_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_gradeReviewId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "GradeComposition" DROP CONSTRAINT "GradeComposition_classId_fkey";

-- DropForeignKey
ALTER TABLE "GradeReview" DROP CONSTRAINT "GradeReview_studentGradeId_fkey";

-- DropForeignKey
ALTER TABLE "GradeReview" DROP CONSTRAINT "GradeReview_studentId_fkey";

-- DropForeignKey
ALTER TABLE "GradeReview" DROP CONSTRAINT "GradeReview_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_fkey";

-- DropForeignKey
ALTER TABLE "StudentGrade" DROP CONSTRAINT "StudentGrade_gradeCompositionId_fkey";

-- DropForeignKey
ALTER TABLE "StudentGrade" DROP CONSTRAINT "StudentGrade_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_userId_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
DROP COLUMN "adminId",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Class" DROP CONSTRAINT "Class_pkey",
DROP COLUMN "classId",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "code" DROP NOT NULL,
ALTER COLUMN "invitationLink" DROP NOT NULL,
ADD CONSTRAINT "Class_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ClassInvitationForStudent" DROP CONSTRAINT "ClassInvitationForStudent_pkey",
ALTER COLUMN "studentId" SET DATA TYPE TEXT,
ALTER COLUMN "classId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ClassInvitationForStudent_pkey" PRIMARY KEY ("classId", "studentId");

-- AlterTable
ALTER TABLE "ClassInvitationForTeacher" DROP CONSTRAINT "ClassInvitationForTeacher_pkey",
ALTER COLUMN "teacherId" SET DATA TYPE TEXT,
ALTER COLUMN "classId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ClassInvitationForTeacher_pkey" PRIMARY KEY ("classId", "teacherId");

-- AlterTable
ALTER TABLE "ClassMember" DROP CONSTRAINT "ClassMember_pkey",
ALTER COLUMN "classId" SET DATA TYPE TEXT,
ALTER COLUMN "studentId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ClassMember_pkey" PRIMARY KEY ("classId", "studentId");

-- AlterTable
ALTER TABLE "ClassTeacher" DROP CONSTRAINT "ClassTeacher_pkey",
ALTER COLUMN "classId" SET DATA TYPE TEXT,
ALTER COLUMN "teacherId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ClassTeacher_pkey" PRIMARY KEY ("classId", "teacherId");

-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
DROP COLUMN "commentId",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "GradeComposition" DROP CONSTRAINT "GradeComposition_pkey",
DROP COLUMN "gradeCompositionId",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "percentage" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "classId" SET DATA TYPE TEXT,
ADD CONSTRAINT "GradeComposition_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "GradeReview" DROP CONSTRAINT "GradeReview_pkey",
DROP COLUMN "gradeReviewId",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "studentId" SET DATA TYPE TEXT,
ALTER COLUMN "teacherId" SET DATA TYPE TEXT,
ALTER COLUMN "studentGradeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "GradeReview_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
DROP COLUMN "studentId",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "StudentGrade" DROP CONSTRAINT "StudentGrade_pkey",
DROP COLUMN "studentGradeId",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "gradeCompositionId" SET DATA TYPE TEXT,
ALTER COLUMN "studentId" SET DATA TYPE TEXT,
ADD CONSTRAINT "StudentGrade_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_pkey",
DROP COLUMN "teacherId",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "userId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassTeacher" ADD CONSTRAINT "ClassTeacher_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassTeacher" ADD CONSTRAINT "ClassTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassMember" ADD CONSTRAINT "ClassMember_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassMember" ADD CONSTRAINT "ClassMember_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassInvitationForTeacher" ADD CONSTRAINT "ClassInvitationForTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassInvitationForTeacher" ADD CONSTRAINT "ClassInvitationForTeacher_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassInvitationForStudent" ADD CONSTRAINT "ClassInvitationForStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassInvitationForStudent" ADD CONSTRAINT "ClassInvitationForStudent_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeComposition" ADD CONSTRAINT "GradeComposition_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGrade" ADD CONSTRAINT "StudentGrade_gradeCompositionId_fkey" FOREIGN KEY ("gradeCompositionId") REFERENCES "GradeComposition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGrade" ADD CONSTRAINT "StudentGrade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeReview" ADD CONSTRAINT "GradeReview_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeReview" ADD CONSTRAINT "GradeReview_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeReview" ADD CONSTRAINT "GradeReview_studentGradeId_fkey" FOREIGN KEY ("studentGradeId") REFERENCES "StudentGrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_gradeReviewId_fkey" FOREIGN KEY ("gradeReviewId") REFERENCES "GradeReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
