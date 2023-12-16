/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Added the required column `type` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- CreateTable
CREATE TABLE "Student" (
    "studentId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("studentId")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "teacherId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("teacherId")
);

-- CreateTable
CREATE TABLE "Admin" (
    "adminId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminId")
);

-- CreateTable
CREATE TABLE "Class" (
    "classId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "invitationLink" TEXT NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("classId")
);

-- CreateTable
CREATE TABLE "ClassTeacher" (
    "classId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,

    CONSTRAINT "ClassTeacher_pkey" PRIMARY KEY ("classId","teacherId")
);

-- CreateTable
CREATE TABLE "ClassMember" (
    "classId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "ClassMember_pkey" PRIMARY KEY ("classId","studentId")
);

-- CreateTable
CREATE TABLE "ClassInvitationForTeacher" (
    "teacherId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "invitedTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassInvitationForTeacher_pkey" PRIMARY KEY ("classId","teacherId")
);

-- CreateTable
CREATE TABLE "ClassInvitationForStudent" (
    "studentId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "invitedTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassInvitationForStudent_pkey" PRIMARY KEY ("classId","studentId")
);

-- CreateTable
CREATE TABLE "GradeComposition" (
    "gradeCompositionId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "isFinalized" BOOLEAN NOT NULL DEFAULT false,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "GradeComposition_pkey" PRIMARY KEY ("gradeCompositionId")
);

-- CreateTable
CREATE TABLE "StudentGrade" (
    "studentGradeId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gradeCompositionId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "grade" INTEGER NOT NULL,

    CONSTRAINT "StudentGrade_pkey" PRIMARY KEY ("studentGradeId")
);

-- CreateTable
CREATE TABLE "GradeReview" (
    "gradeReviewId" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "studentGradeId" INTEGER NOT NULL,
    "currentGrade" DOUBLE PRECISION NOT NULL,
    "expectedGrade" DOUBLE PRECISION NOT NULL,
    "finalGrade" DOUBLE PRECISION,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradeReview_pkey" PRIMARY KEY ("gradeReviewId")
);

-- CreateTable
CREATE TABLE "Comment" (
    "commentId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gradeReviewId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("commentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Class_code_key" ON "Class"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Class_invitationLink_key" ON "Class"("invitationLink");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassTeacher" ADD CONSTRAINT "ClassTeacher_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("classId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassTeacher" ADD CONSTRAINT "ClassTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("teacherId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassMember" ADD CONSTRAINT "ClassMember_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("classId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassMember" ADD CONSTRAINT "ClassMember_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassInvitationForTeacher" ADD CONSTRAINT "ClassInvitationForTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("teacherId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassInvitationForTeacher" ADD CONSTRAINT "ClassInvitationForTeacher_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("classId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassInvitationForStudent" ADD CONSTRAINT "ClassInvitationForStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassInvitationForStudent" ADD CONSTRAINT "ClassInvitationForStudent_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("classId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeComposition" ADD CONSTRAINT "GradeComposition_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("classId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGrade" ADD CONSTRAINT "StudentGrade_gradeCompositionId_fkey" FOREIGN KEY ("gradeCompositionId") REFERENCES "GradeComposition"("gradeCompositionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGrade" ADD CONSTRAINT "StudentGrade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeReview" ADD CONSTRAINT "GradeReview_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeReview" ADD CONSTRAINT "GradeReview_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("teacherId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeReview" ADD CONSTRAINT "GradeReview_studentGradeId_fkey" FOREIGN KEY ("studentGradeId") REFERENCES "StudentGrade"("studentGradeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_gradeReviewId_fkey" FOREIGN KEY ("gradeReviewId") REFERENCES "GradeReview"("gradeReviewId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
