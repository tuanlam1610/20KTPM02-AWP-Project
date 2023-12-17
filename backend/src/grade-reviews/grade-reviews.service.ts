import { Injectable } from '@nestjs/common';
import { CreateGradeReviewDto } from './dto/create-grade-review.dto';
import { UpdateGradeReviewDto } from './dto/update-grade-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GradeReviewsService {
  constructor(private prisma: PrismaService) {}
  async create(createGradeReviewDto: CreateGradeReviewDto) {
    try {
      const fetchedStudent = await this.prisma.student.findUnique({
        where: { id: createGradeReviewDto.studentId },
      });

      if (!fetchedStudent) {
        throw new Error(
          `GradeReview with student ID ${createGradeReviewDto.studentId} not found`,
        );
      }
      const fetchedTeacher = await this.prisma.teacher.findUnique({
        where: { id: createGradeReviewDto.teacherId },
      });

      if (!fetchedTeacher) {
        throw new Error(
          `GradeReview withteacher ID ${createGradeReviewDto.studentId} not found`,
        );
      }

      const fetchedStudentsGrade = await this.prisma.studentGrade.findUnique({
        where: { id: createGradeReviewDto.studentGradeId },
      });

      if (!fetchedStudentsGrade) {
        throw new Error(
          `GradeReview with student grade ID ${createGradeReviewDto.studentGradeId} not found`,
        );
      }

      const fetchedComment = await this.prisma.comment.findMany({
        where: { id: { in: createGradeReviewDto.comment } },
      });

      if (fetchedComment.length !== createGradeReviewDto.comment.length) {
        const notFoundIds = createGradeReviewDto.comment.filter(
          (sgId) => !fetchedComment.some((sg) => sg.id === sgId),
        );
        throw new Error(
          `Student grades with IDs ${notFoundIds.join(', ')} not found`,
        );
      }

      const newGradeReview = await this.prisma.gradeReview.create({
        data: {
          currentGrade: createGradeReviewDto.currentGrade,
          expectedGrade: createGradeReviewDto.expectedGrade,
          finalGrade: createGradeReviewDto.finalGrade,
          explanation: createGradeReviewDto.explanation,
          comment: {
            connect: fetchedComment.map((sg) => ({ id: sg.id })),
          },
          student: { connect: { id: fetchedStudent.id } },
          teacher: { connect: { id: fetchedTeacher.id } },
          studentGrade: { connect: { id: fetchedStudentsGrade.id } },
        },
      });

      return newGradeReview;
    } catch (error) {
      // Custom error handling/logging/reporting
      throw new Error(`Failed to create grade composition: ${error.message}`);
    }
  }

  findAll() {
    return this.prisma.gradeReview.findMany({
      // include: {
      //   student: true,
      //   teacher: true,
      //   studentGrade: true,
      //   comment: true,
      // },
    });
  }

  findOne(id: string) {
    return this.prisma.gradeReview.findUnique({
      where: { id },
      // include: {
      //   student: true,
      //   teacher: true,
      //   studentGrade: true,
      //   comment: true,
      // },
    });
  }

  async update(id: string, updateGradeReviewDto: UpdateGradeReviewDto) {
    try {
      const fetchedStudent = await this.prisma.student.findUnique({
        where: { id: updateGradeReviewDto.studentId },
      });

      if (!fetchedStudent) {
        throw new Error(
          `GradeReview with student ID ${updateGradeReviewDto.studentId} not found`,
        );
      }

      const fetchedTeacher = await this.prisma.teacher.findUnique({
        where: { id: updateGradeReviewDto.teacherId },
      });

      if (!fetchedTeacher) {
        throw new Error(
          `GradeReview with teacher ID ${updateGradeReviewDto.teacherId} not found`,
        );
      }

      const fetchedStudentsGrade = await this.prisma.studentGrade.findUnique({
        where: { id: updateGradeReviewDto.studentGradeId },
      });

      if (!fetchedStudentsGrade) {
        throw new Error(
          `GradeReview with student grade ID ${updateGradeReviewDto.studentGradeId} not found`,
        );
      }

      const fetchedComment = await this.prisma.comment.findMany({
        where: { id: { in: updateGradeReviewDto.comment } },
      });

      if (fetchedComment.length !== updateGradeReviewDto.comment.length) {
        const notFoundIds = updateGradeReviewDto.comment.filter(
          (sgId) => !fetchedComment.some((sg) => sg.id === sgId),
        );
        throw new Error(
          `Student grades with IDs ${notFoundIds.join(', ')} not found`,
        );
      }

      const updatedGradeReview = await this.prisma.gradeReview.update({
        where: { id: id }, // Add your unique identifier for the GradeReview you want to update
        data: {
          currentGrade: updateGradeReviewDto.currentGrade,
          expectedGrade: updateGradeReviewDto.expectedGrade,
          finalGrade: updateGradeReviewDto.finalGrade,
          explanation: updateGradeReviewDto.explanation,
          comment: {
            //Todo: comment might not be related
            connect: fetchedComment.map((sg) => ({ id: sg.id })),
          },
          student: { connect: { id: fetchedStudent.id } },
          teacher: { connect: { id: fetchedTeacher.id } },
          studentGrade: { connect: { id: fetchedStudentsGrade.id } },
        },
      });

      return updatedGradeReview;
    } catch (error) {
      // Custom error handling/logging/reporting
      throw new Error(`Failed to update grade review: ${error.message}`);
    }
  }

  remove(id: string) {
    return this.prisma.gradeReview.delete({ where: { id } });
  }
}
