import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private notiService: NotificationsService,
  ) {}
  async createAndNotify(createCommentDto: CreateCommentDto) {
    try {
      const newComment = await this.prisma.comment.create({
        data: {
          content: createCommentDto.content,
          userId: createCommentDto.userId,
          gradeReviewId: createCommentDto.gradeReviewId,
        },
      });
      const user = await this.prisma.user.findUnique({
        where: { id: createCommentDto.userId },
      });

      const isStudent = user.roles.includes('student');
      const receiverField = isStudent ? 'teacherId' : 'studentId';
      const receiverId = await this.prisma.gradeReview
        .findUnique({
          where: { id: createCommentDto.gradeReviewId },
          select: { [receiverField]: true },
        })
        .then((res) => res && res[receiverField]);

      // Ensure receiverId is a string, otherwise, handle the case where it's an array of objects
      const finalReceiverId = Array.isArray(receiverId)
        ? receiverId[0]?.[receiverField]
        : receiverId;

      if (finalReceiverId) {
        const notificationData = {
          action: 'COMMENT_CREATED_NOTIFICATION_SEND',
          object: 'comment',
          objectId: newComment.id,
          objectType: 'comment',
          content: `New comment on your grade review.`,
          senderId: createCommentDto.userId,
          isRead: false,
          receiver: finalReceiverId,
        };

        // await this.notiService.createAndSendNotifications(
        //   //Todo make anotehr send notifcation function for comment Room
        //   [notificationData],
        //   finalReceiverId,
        // );
        //Add a service to send notifcation to room
      }
      //also add live chat room

      return newComment;
    } catch (error) {
      // Custom error handling/logging/reporting
      throw new Error(`Failed to create grade composition: ${error.message}`);
    }
  }

  async create(createCommentDto: CreateCommentDto) {
    try {
      const newComment = await this.prisma.comment.create({
        data: {
          content: createCommentDto.content,
          userId: createCommentDto.userId,
          gradeReviewId: createCommentDto.gradeReviewId,
        },
      });
      // const user = await this.prisma.user.findUnique({
      //   where: { id: createCommentDto.userId },
      // });

      // const isStudent = user.roles.includes('student');
      // const receiverField = isStudent ? 'teacherId' : 'studentId';
      // const receiverId = await this.prisma.gradeReview
      //   .findUnique({
      //     where: { id: createCommentDto.gradeReviewId },
      //     select: { [receiverField]: true },
      //   })
      //   .then((res) => res && res[receiverField]);

      // // Ensure receiverId is a string, otherwise, handle the case where it's an array of objects
      // const finalReceiverId = Array.isArray(receiverId)
      //   ? receiverId[0]?.[receiverField]
      //   : receiverId;

      // if (finalReceiverId) {
      //   const notificationData = {
      //     action: 'COMMENT_CREATED_NOTIFICATION_SEND',
      //     object: 'comment',
      //     objectId: newComment.id,
      //     objectType: 'comment',
      //     content: `New comment on your grade review.`,
      //     senderId: createCommentDto.userId,
      //     isRead: false,
      //     receiver: finalReceiverId,
      //   };

      //   await this.notiService.createAndSendNotifications(
      //     //Todo make anotehr send notifcation function for comment Room
      //     [notificationData],
      //     finalReceiverId,
      //   );
      //   //awwait send comment
      // }

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
