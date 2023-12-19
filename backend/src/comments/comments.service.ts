import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}
  async create(createCommentDto: CreateCommentDto) {
    try {
      const newComment = await this.prisma.comment.create({
        data: {
          content: createCommentDto.content,
          userId: createCommentDto.userId,
          gradeReviewId: createCommentDto.gradeReviewId,
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
      const updatedComment = await this.prisma.comment.update({
        where: { id: id },
        data: {
          content: updateCommentDto.content,
          userId: updateCommentDto.userId,
          gradeReviewId: updateCommentDto.gradeReviewId,
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
