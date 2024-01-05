import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGradeReviewDto } from './dto/create-grade-review.dto';
import { UpdateGradeReviewDto } from './dto/update-grade-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';

@Injectable()
export class GradeReviewsService {
  constructor(
    private prisma: PrismaService,
    private notiService: NotificationsService,
  ) {}

  async finalizeGradeReview(id: string, teacherId: string, finalGrade: number) {
    const gr = await this.prisma.gradeReview.update({
      where: { id },
      data: { finalGrade, status: 'Accepted', teacherId: teacherId },
    });
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId },
    });
    const student = await this.prisma.student.findUnique({
      where: { id: gr.studentId },
    });
    const notificationData: CreateNotificationDto = {
      action: 'GR_FINALIZED_NOTIFICATION_SEND',
      object: 'grade review finalized',
      objectId: id,
      objectType: 'gradeReview',
      content: `Your grade review has been finalized.`,
      senderId: teacher.userId,
      isRead: false,
      receiverId: student.userId,
    };

    await this.notiService.createAndSendOneNotification(
      notificationData,
      student.userId,
    );
    //REplace with send noti to online student
  }
  async createAndNotify(createGradeReviewDto: CreateGradeReviewDto) {
    try {
      let fetchedComment = [];
      if (createGradeReviewDto.comment) {
        fetchedComment = await this.prisma.comment.findMany({
          where: { id: { in: createGradeReviewDto.comment } },
        });
      }

      if (fetchedComment.length ?? 0 !== createGradeReviewDto.comment.length) {
        const notFoundIds = createGradeReviewDto.comment.filter(
          (sgId) => !fetchedComment.some((sg) => sg.id === sgId),
        );
        throw new NotFoundException(
          `comments with IDs ${notFoundIds.join(', ')} not found`,
        );
      }

      const sg = await this.prisma.studentGrade.findUnique({
        where: { id: createGradeReviewDto.studentGradeId },
      });
      if (!sg)
        throw new BadRequestException(
          `grade with IDs ${createGradeReviewDto.studentGradeId} not found`,
        );

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

      //Send notification to teachers
      //Todo make this adapt to a list of Teacher
      const teachers = await this.prisma.classTeacher.findMany({
        where: { classId: createGradeReviewDto.classId },
        select: { teacher: { select: { userId: true } } },
      });
      const student = await this.prisma.student.findUnique({
        where: { id: createGradeReviewDto.studentId },
      });

      const notifyBaseData = {
        action: 'GR_CREATED_NOTIFICATION_SEND',
        object: 'grade review',
        objectId: newGradeReview.id,
        objectType: 'gradeReview',
        content: `New grade review has been created.`,
        senderId: student.userId,
        isRead: false,
      };
      teachers.forEach(async (classT) => {
        const notificationData: CreateNotificationDto = {
          ...notifyBaseData,
          receiverId: classT.teacher.userId,
        };
        await this.notiService.createAndSendOneNotification(
          notificationData,
          notificationData.receiverId,
        );
        //replace with new send command specific to teacher
      });

      return newGradeReview;
    } catch (error) {
      // Custom error handling/logging/reporting
      throw new Error(`Failed to create grade review: ${error.message}`);
    }
  }

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
          createdAt: true,
          updatedAt: true,
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
              gradeComposition: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          comment: {
            include: {
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
      let fetchedComment = [];
      if (createGradeReviewDto.comment) {
        fetchedComment = await this.prisma.comment.findMany({
          where: { id: { in: createGradeReviewDto.comment } },
        });
      }

      if (fetchedComment.length ?? 0 !== createGradeReviewDto.comment.length) {
        const notFoundIds = createGradeReviewDto.comment.filter(
          (sgId) => !fetchedComment.some((sg) => sg.id === sgId),
        );
        throw new NotFoundException(
          `comments with IDs ${notFoundIds.join(', ')} not found`,
        );
      }

      const sg = await this.prisma.studentGrade.findUnique({
        where: { id: createGradeReviewDto.studentGradeId },
      });
      if (!sg)
        throw new BadRequestException(
          `grade with IDs ${createGradeReviewDto.studentGradeId} not found`,
        );

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
      let fetchedComment = [];
      if (updateGradeReviewDto.comment) {
        fetchedComment = await this.prisma.comment.findMany({
          where: { id: { in: updateGradeReviewDto.comment } },
        });
      }

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

  async remove(id: string) {
    //delete all comments
    const deleteComments = await this.prisma.comment.deleteMany({
      where: { gradeReviewId: id },
    });
    return this.prisma.gradeReview.delete({ where: { id } });
  }
}
