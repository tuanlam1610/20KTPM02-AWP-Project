import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGradeCompositionDto } from './dto/create-grade-composition.dto';
import { UpdateGradeCompositionDto } from './dto/update-grade-composition.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StudentGradesService } from 'src/student-grades/student-grades.service';
import { UpdateAllStudentGradeDto } from './dto/update-all-student-grade.dto';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class GradeCompositionsService {
  constructor(
    private prisma: PrismaService,
    private sgService: StudentGradesService,
    private notiService: NotificationsService,
  ) {}
  async finalizeGradeComposition(
    gradeCompositionId: string,
    teacherId: string,
  ) {
    const gradeComposition = await this.prisma.gradeComposition.update({
      where: { id: gradeCompositionId },
      data: { isFinalized: true },
    });

    const notificationData: CreateNotificationDto = {
      action: 'GC_FINALIZED_NOTIFICATION_SEND',
      object: 'grade composition finalized',
      objectId: gradeComposition.id,
      objectType: 'gradeComposition',
      content: `Your grade for ${gradeComposition.name} has been finalized.`,
      senderId: teacherId,
      isRead: false,
      receiverId: '',
    };
    const students = await this.prisma.student.findMany({
      where: { classMember: { some: { classId: gradeComposition.classId } } },
    });
    console.log(students);
    const notifications = students.map((student) => ({
      ...notificationData,
      receiverId: student.userId,
    }));
    console.log(
      notifications[0].senderId,
      'Bismalaah',
      notifications[0].receiverId,
    );
    await this.notiService.createAndSendNotifications(
      notifications,
      gradeComposition.classId,
    );

    if (gradeComposition) {
    } else {
      throw new BadRequestException(
        `Grade composition with ID ${gradeCompositionId} not found`,
      );
    }
  }

  async updateAllStudentGrades(
    gradeCompositionId: string,
    classId: string,
    updateAllStudentGradeDto: UpdateAllStudentGradeDto,
  ) {
    const { studentGrades } = updateAllStudentGradeDto;

    // Fetch all students based on the provided studentGrades
    const studentToUpdate = await this.prisma.student.findMany({
      where: { id: { in: studentGrades.map((sg) => sg.studentId) } },
    });

    // Check if all students from DTO exist in the database
    const foundStudentIds = studentToUpdate.map((student) => student.id);
    const notFoundIds = studentGrades
      .filter((sg) => !foundStudentIds.includes(sg.studentId))
      .map((sgId) => sgId.studentId);

    if (notFoundIds.length > 0) {
      throw new NotFoundException(
        `Student grades with IDs ${notFoundIds.join(', ')} not found`,
      );
    }

    // Update each student's grade
    const updatedStudentGrades = await Promise.all(
      studentGrades.map(async (sg) => {
        try {
          // Fetch existing student grade or create a new one if it doesn't exist
          const existingStudentGrade = await this.sgService.findStudentGrade(
            sg.studentId,
            gradeCompositionId,
          );

          const updatedStudentGrade =
            await this.sgService.updateOneStudentGrade(
              existingStudentGrade?.id,
              classId,
              sg.grade,
            );

          return updatedStudentGrade;
        } catch (error) {
          // Handle individual student grade update errors
          // You might log these errors or handle them according to your application's requirements
          console.error(
            `Failed to update grade for student ${sg.studentId}: ${error}`,
          );
          return null;
        }
      }),
    );

    return updatedStudentGrades.filter((grade) => grade !== null);
  }

  async getStudentsGrade(gradeCompositionId: string) {
    const gradeComposition = await this.prisma.gradeComposition.findUnique({
      where: { id: gradeCompositionId },
      include: {
        studentGrades: {
          select: {
            id: true,
            student: {
              select: {
                id: true,
                name: true,
              },
            },
            grade: true,
          },
        },
      },
    });
    const grade = gradeComposition.studentGrades.map((sg) => {
      return {
        id: sg.id,
        studentId: sg.student.id,
        name: sg.student.name,
        grade: sg.grade,
      };
    });

    return { name: gradeComposition.name, studentGrades: grade };
  }

  async populateStudentGrade(gradeCompositionId: string) {
    const gradeComposition = await this.prisma.gradeComposition.findUnique({
      where: { id: gradeCompositionId },
      include: { studentGrades: true },
    });

    const classId = gradeComposition.classId;
    const studentGrades = gradeComposition.studentGrades;

    const classMembers = await this.prisma.classMember.findMany({
      where: { classId },
      include: { student: true },
    });

    const studentIds = classMembers.map((cm) => cm.studentId);

    const studentIdsWithNoGrade = studentIds.filter(
      (studentId) =>
        !studentGrades.some(
          (studentGrade) => studentGrade.studentId === studentId,
        ),
    );

    const studentGradesToCreate = studentIdsWithNoGrade.map((studentId) => ({
      student: { connect: { id: studentId } },
    }));

    const result = await this.prisma.gradeComposition.update({
      where: { id: gradeCompositionId },
      data: { studentGrades: { create: studentGradesToCreate } },
    });
    console.log(result);
  }

  async create(createGradeCompositionDto: CreateGradeCompositionDto) {
    try {
      let fetchedStudentsGrade = [];
      if (createGradeCompositionDto.studentGrades) {
        fetchedStudentsGrade = await this.prisma.student.findMany({
          where: { id: { in: createGradeCompositionDto.studentGrades } },
        });

        {
          if (
            fetchedStudentsGrade.length ??
            0 !== createGradeCompositionDto.studentGrades.length
          ) {
            const notFoundIds = createGradeCompositionDto.studentGrades.filter(
              (sgId) => !fetchedStudentsGrade.some((sg) => sg.id === sgId),
            );
            throw new Error(
              `Student grades with IDs ${notFoundIds.join(', ')} not found`,
            );
          }
        }
      }
      const newGradeComposition = await this.prisma.gradeComposition.create({
        data: {
          name: createGradeCompositionDto.name,
          percentage: createGradeCompositionDto.percentage,
          rank: createGradeCompositionDto.rank,
          isFinalized: createGradeCompositionDto.isFinalized,
          classId: createGradeCompositionDto.classId,
          studentGrades: {
            create: fetchedStudentsGrade.map((sg) => ({
              student: { connect: { id: sg.id } },
            })),
          },
        },
      });
      this.populateStudentGrade(newGradeComposition.id);
      return newGradeComposition;
    } catch (error) {
      // Custom error handling/logging/reporting
      throw new Error(`Failed to create grade composition: ${error.message}`);
    }
  }

  findAll() {
    return this.prisma.gradeComposition.findMany({
      include: { class: true, studentGrades: true },
    });
  }

  findOne(id: string) {
    return this.prisma.gradeComposition.findUnique({
      where: { id },
      include: { class: true, studentGrades: true },
    });
  }

  async update(
    id: string,
    updateGradeCompositionDto: UpdateGradeCompositionDto,
  ) {
    try {
      let fetchedStudentsGrade = [];
      if (updateGradeCompositionDto.studentGrades) {
        fetchedStudentsGrade = await this.prisma.student.findMany({
          where: { id: { in: updateGradeCompositionDto.studentGrades } },
        });

        if (
          fetchedStudentsGrade.length ??
          0 !== updateGradeCompositionDto.studentGrades.length
        ) {
          const notFoundIds = updateGradeCompositionDto.studentGrades.filter(
            (sgId) => !fetchedStudentsGrade.some((sg) => sg.id === sgId),
          );
          throw new Error(
            `Student grades with IDs ${notFoundIds.join(', ')} not found`,
          );
        }
      }
      const updatedGradeComposition = await this.prisma.gradeComposition.update(
        {
          where: { id },
          data: {
            name: updateGradeCompositionDto.name,
            percentage: updateGradeCompositionDto.percentage,
            rank: updateGradeCompositionDto.rank,
            isFinalized: updateGradeCompositionDto.isFinalized,
            classId: updateGradeCompositionDto.classId,
            studentGrades: {
              //"set"
              create: fetchedStudentsGrade.map((sg) => ({
                student: { connect: { id: sg.id } },
              })),
              //Wat the hell was "set"
            },
          },
        },
      );

      return updatedGradeComposition;
    } catch (error) {
      // Custom error handling/logging/reporting
      throw new Error(`Failed to update grade composition: ${error.message}`);
    }
  }

  async remove(id: string) {
    const gc = await this.prisma.gradeComposition.findUnique({
      where: { id },
      include: {
        studentGrades: {
          include: { gradeReview: true },
        },
      },
    });
    await this.prisma.comment.deleteMany({
      where: {
        gradeReviewId: { in: gc.studentGrades.map((sg) => sg.gradeReview.id) },
      },
    });
    await this.prisma.gradeReview.deleteMany({
      where: { studentGradeId: { in: gc.studentGrades.map((sg) => sg.id) } },
    });
    await this.prisma.studentGrade.deleteMany({
      where: { gradeCompositionId: id },
    });

    return this.prisma.gradeComposition.delete({ where: { id } });
  }
}
