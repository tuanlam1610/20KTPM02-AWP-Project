import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}
  async create(createCommentDto: CreateCommentDto) {
    try {
      const fetchedGradeReview = await this.prisma.gradeReview.findUnique({
        where: { id: createCommentDto.gradeReviewId },
      });

      if (!fetchedGradeReview) {
        throw new Error(
          `GradeReview with ID ${createCommentDto.gradeReviewId} not found`,
        );
      }

      const fetchedUser = await this.prisma.user.findUnique({
        where: { id: createCommentDto.userId },
      });

      if (!fetchedUser) {
        throw new Error(`User with ID ${createCommentDto.userId} not found`);
      }

      const newComment = await this.prisma.comment.create({
        data: {
          content: createCommentDto.content,
          user: { connect: { id: fetchedUser.id } },
          gradeReview: { connect: { id: fetchedGradeReview.id } },
        },
      });

      return newComment;
    } catch (error) {
      // Custom error handling/logging/reporting
      throw new Error(`Failed to create grade composition: ${error.message}`);
    }
  }

  findAll() {
    return this.prisma.comment.findMany({});
  }
  findOne(id: string) {
    return this.prisma.comment.findUnique({ where: { id: id } });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    try {
      const fetchedGradeReview = await this.prisma.gradeReview.findUnique({
        where: { id: updateCommentDto.gradeReviewId },
      });

      if (!fetchedGradeReview) {
        throw new Error(
          `GradeReview with ID ${updateCommentDto.gradeReviewId} not found`,
        );
      }

      const fetchedUser = await this.prisma.user.findUnique({
        where: { id: updateCommentDto.userId },
      });

      if (!fetchedUser) {
        throw new Error(`User with ID ${updateCommentDto.userId} not found`);
      }

      const updatedComment = await this.prisma.comment.update({
        where: { id: id },
        data: {
          content: updateCommentDto.content,
          user: { connect: { id: fetchedUser.id } },
          gradeReview: { connect: { id: fetchedGradeReview.id } },
        },
      });

      return updatedComment;
    } catch (error) {
      // Custom error handling/logging/reporting
      throw new Error(`Failed to update comment: ${error.message}`);
    }
  }

  remove(id: string) {
    return this.prisma.comment.delete({ where: { id: id } });
  }
}
