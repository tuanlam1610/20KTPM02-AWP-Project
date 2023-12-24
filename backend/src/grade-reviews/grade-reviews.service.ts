import { Injectable } from '@nestjs/common';
import { CreateGradeReviewDto } from './dto/create-grade-review.dto';
import { UpdateGradeReviewDto } from './dto/update-grade-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GradeReviewsService {
  constructor(private prisma: PrismaService) {}
  async getGradeReviewDetails(id: string) {
    try {
      const gradeReview = await this.prisma.gradeReview.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          currentGrade: true,
          expectedGrade: true,
          finalGrade: true,
          explanation: true,
          student: {
            select: {
              id: true,
              name: true,
              userId: true,
            },
          },
          teacher: {
            select: {
              id: true,
              name: true,
              userId: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
            },
          },
          studentGrade: {
            select: {
              id: true,
              grade: true,
            },
          },
          comment: {
            select: {
              id: true,
              content: true,
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!gradeReview) {
        throw new Error(`Grade review with ID ${id} not found`);
      }

      return gradeReview;
    } catch (error) {
      // Custom error handling/logging/reporting
      throw new Error(`Failed to fetch grade review details: ${error.message}`);
    }
  }

  async create(createGradeReviewDto: CreateGradeReviewDto) {
    try {
      const fetchedComment = await this.prisma.comment.findMany({
        where: { id: { in: createGradeReviewDto.comment } },
      });

      if (fetchedComment.length ?? 0 !== createGradeReviewDto.comment.length) {
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
          status: createGradeReviewDto.status,
          explanation: createGradeReviewDto.explanation,
          comment: {
            connect: fetchedComment.map((sg) => ({ id: sg.id })),
          },
          studentId: createGradeReviewDto.studentId,
          teacherId: createGradeReviewDto.teacherId,
          classId: createGradeReviewDto.classId,
          studentGradeId: createGradeReviewDto.studentGradeId,
        },
      });

      return newGradeReview;
    } catch (error) {
      // Custom error handling/logging/reporting
      throw new Error(`Failed to create grade review: ${error.message}`);
    }
  }

  findAll() {
    return this.prisma.gradeReview.findMany({
      include: {
        student: true,
        teacher: true,
        studentGrade: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.gradeReview.findUnique({
      where: { id },
      include: {
        student: true,
        teacher: true,
        studentGrade: true,
      },
    });
  }

  async update(id: string, updateGradeReviewDto: UpdateGradeReviewDto) {
    try {
      const fetchedComment = await this.prisma.comment.findMany({
        where: { id: { in: updateGradeReviewDto.comment } },
      });

      if (fetchedComment.length ?? 0 !== updateGradeReviewDto.comment.length) {
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
          status: updateGradeReviewDto.status,
          comment: {
            //Todo: comment might not be related
            connect: fetchedComment.map((sg) => ({ id: sg.id })),
          },
          studentId: updateGradeReviewDto.studentId,
          teacherId: updateGradeReviewDto.teacherId,
          studentGradeId: updateGradeReviewDto.studentGradeId,
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
