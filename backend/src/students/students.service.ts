import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentDto } from './dto/create-students.dto';
import { UpdateStudentDto } from './dto/update-students.dto';
import { PopulateClassDto } from 'src/classes/dto/class-populate.dto';
import { Prisma } from '@prisma/client';
import { BulkMappingDto } from './dto/join-class.dto';

enum GradeReviewStatusFilter {
  Open = 'Open',
  Accepted = 'Accepted',
  Denied = 'Denied',
  All = 'All',
}
@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  getUnmappedStudents() {
    return this.prisma.student.findMany({
      where: { userId: null },
    });
  }

  async getStudentGradeReview(
    studentId: string,
    page?: number,
    limit?: number,
    status?: GradeReviewStatusFilter,
  ) {
    const where: Prisma.GradeReviewWhereInput = {};
    if (status !== GradeReviewStatusFilter.All) {
      where.status = status;
    }
    // For total count
    const totalRecord = await this.prisma.gradeReview.count({
      where: {
        class: {
          classMember: {
            some: {
              studentId: studentId,
            },
          },
        },
      },
    });

    const totalPage = Math.ceil(totalRecord / limit);

    if (page * limit > totalRecord) {
      throw new BadRequestException(
        `Page limit out of bound. Total Page: ${totalPage} `,
      );
    }

    const studentGradeReviews = await this.prisma.gradeReview.findMany({
      where: {
        class: {
          classMember: {
            some: {
              studentId: studentId,
            },
          },
        },
      },
      skip: page * limit ?? 0,
      take: limit ?? 10,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        currentGrade: true,
        expectedGrade: true,
        finalGrade: true,
        explanation: true,
        status: true,
        studentGrade: {
          select: {
            grade: true,
            gradeComposition: {
              select: {
                name: true,
                percentage: true,
              },
            },
          },
        },
        student: {
          select: {
            name: true,
          },
        },
        teacher: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      studentGradeReviews,
      currentPage: page,
      totalPage: totalPage,
      totalRecord: totalRecord,
    };
  }
  async joinClassByCode(classCode: string, studentId: string) {
    const classToJoin = await this.prisma.class.findUnique({
      where: { code: classCode },
    });
    if (!classToJoin) {
      //return error: class not found
      throw new BadRequestException('Class not found');
    }

    const classInvitationForStudent =
      await this.prisma.classInvitationForStudent.findUnique({
        where: {
          classId_studentId: { classId: classToJoin.id, studentId: studentId },
        },
      });

    if (classInvitationForStudent) {
      //return error: class invitation not found
      await this.prisma.classInvitationForStudent.delete({
        where: {
          classId_studentId: { classId: classToJoin.id, studentId: studentId },
        },
      });
    }

    return this.prisma.classMember.upsert({
      where: {
        classId_studentId: { classId: classToJoin.id, studentId: studentId },
      },
      update: {
        isJoined: true,
      },
      create: {
        classId: classToJoin.id,
        studentId: studentId,
        isJoined: true,
      },
    });
  }

  async getAllClassesOfStudent(studentId: string) {
    const classesOfStudent = await this.prisma.student.findUnique({
      where: { id: studentId },
      select: {
        classMember: {
          where: { isJoined: true, class: { isActive: true } },
          select: {
            class: {
              select: {
                id: true,
                name: true,
                description: true,
                code: true,
                isActive: false,
              },
            },
          },
        },
      },
    });
    return (
      classesOfStudent?.classMember?.map((ct) => ({
        id: ct.class.id,
        name: ct.class.name,
        description: ct.class.description,
        code: ct.class.code,
      })) || []
    );
  }
  async populateStudents(studentsList: PopulateClassDto) {
    const { students } = studentsList;

    const studentsData = students.map((student) => ({
      name: student.name,
      id: student.studentId,
    }));

    const studentsCreated = await this.prisma.student.createMany({
      data: studentsData,
      // Set `skipDuplicates` to true if you want to skip inserting duplicate records
      skipDuplicates: true,
    });

    return studentsCreated; // MB ignore the students that already exist
  }

  async mapStudentToUser(studentId: string, userId: string) {
    try {
      return this.prisma.student.update({
        where: { id: studentId },
        data: { userId: userId },
      });
    } catch (e) {
      console.log(e, 'User is already mapped');
    }
  }

  async mapMultipleStudentToUser(body: BulkMappingDto) {
    const { users } = body;
    const studentMapping = new Map<string, string>();
    const successfulMappings: string[] = [];
    const failedMappings: { studentId: string; userId: string }[] = [];

    for (const user of users) {
      try {
        const updatedStudent = await this.prisma.student.update({
          where: { id: user.studentId },
          data: { userId: user.userId },
        });

        successfulMappings.push(updatedStudent.id);
        studentMapping.set(updatedStudent.id, user.userId);
      } catch (error) {
        failedMappings.push({ studentId: user.studentId, userId: user.userId });
      }
    }

    return { successful: successfulMappings, failed: failedMappings };
  }

  //CRUD
  async create(createStudentDto: CreateStudentDto) {
    // Fetch StudentGrade by their IDs
    // Batch fetch related entities
    const batchedFetch = await Promise.all([
      createStudentDto.classMember
        ? this.prisma.class.findMany({
            where: { id: { in: createStudentDto.classMember } },
          })
        : [],
      createStudentDto.classInvitationForStudent
        ? this.prisma.class.findMany({
            where: {
              id: { in: createStudentDto.classInvitationForStudent },
            },
          })
        : [],
      createStudentDto.studentGrade
        ? this.prisma.gradeComposition.findMany({
            where: {
              id: { in: createStudentDto.studentGrade },
            },
          })
        : [],
      // createStudentDto.studentGrade
      // ? this.prisma.studentGrade.findMany({
      //     where: {
      //       id: { in: createStudentDto.studentGrade },
      //     },
      //   })
      // : [],
      createStudentDto.gradeReview
        ? this.prisma.gradeReview.findMany({
            where: { id: { in: createStudentDto.gradeReview } },
          })
        : [],
    ]);

    const [
      fetchedClassMember,
      fetchedClassInvitationForStudent,
      fetchedStudentGrade,
      fetchedGradeReview,
    ] = batchedFetch;

    return this.prisma.student.create({
      data: {
        userId: createStudentDto.userId,
        name: createStudentDto.name,
        studentGrade: {
          //TEST: Grade might be missing
          create: fetchedStudentGrade.map((sg) => ({
            gradeComposition: { connect: { id: sg.id } },
          })),
        },
        //TODO: OTM CASE
        gradeReview: {
          connect: fetchedGradeReview.map((gr) => ({
            id: gr.id,
          })),
        },

        classMember: {
          create: fetchedClassMember.map((cm) => ({
            class: { connect: { id: cm.id } },
          })),
        },
        classInvitationForStudent: {
          create: fetchedClassInvitationForStudent.map((cifs) => ({
            class: {
              connect: { id: cifs.id },
            },
          })),
        },
      },
    });
  }

  findOneByUserId(userId: string) {
    return this.prisma.student.findUnique({ where: { userId: userId } });
  }

  async findAll() {
    const students = await this.prisma.student.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    const modifiedStudents = students.map(({ user, ...rest }) => ({
      ...rest,
      userId: user.id,
      userName: user.name,
    }));
    return modifiedStudents;
  }

  // findAllRegistered() {
  //   return this.prisma.student.findMany({ where: { isRegistered: true } });
  // }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({ where: { id: id } });
    //const userWithoutPassword = exclude(student, ['hash', 'hashedRt']);
    //return userWithoutPassword;
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const batchedFetch = await Promise.all([
      updateStudentDto.classMember
        ? this.prisma.class.findMany({
            where: { id: { in: updateStudentDto.classMember } },
          })
        : [],
      updateStudentDto.classInvitationForStudent
        ? this.prisma.class.findMany({
            where: {
              id: { in: updateStudentDto.classInvitationForStudent },
            },
          })
        : [],
      updateStudentDto.studentGrade
        ? this.prisma.gradeComposition.findMany({
            where: {
              id: { in: updateStudentDto.studentGrade },
            },
          })
        : [],
      // updateStudentDto.studentGrade
      // ? this.prisma.studentGrade.findMany({
      //     where: {
      //       id: { in: updateStudentDto.studentGrade },
      //     },
      //   })
      // : [],
      updateStudentDto.gradeReview
        ? this.prisma.gradeReview.findMany({
            where: { id: { in: updateStudentDto.gradeReview } },
          })
        : [],
    ]);

    const [
      fetchedClassMember,
      fetchedClassInvitationForStudent,
      fetchedStudentGrade,
      fetchedGradeReview,
    ] = batchedFetch;

    return this.prisma.student.update({
      where: { id: id }, // Assuming 'id' is the unique identifier for the student
      data: {
        ...updateStudentDto,
        studentGrade: {
          //TEST: Grade might be missing
          create: fetchedStudentGrade.map((sg) => ({
            gradeComposition: { connect: { id: sg.id } },
          })),
        },
        //TODO: OTM CASE
        gradeReview: {
          connect: fetchedGradeReview.map((gr) => ({
            id: gr.id,
          })),
        },

        classMember: {
          create: fetchedClassMember.map((cm) => ({
            class: { connect: { id: cm.id } },
          })),
        },
        classInvitationForStudent: {
          create: fetchedClassInvitationForStudent.map((cifs) => ({
            class: {
              connect: { id: cifs.id },
            },
          })),
        },
      },
    });
  }

  //   updateByEmail(email: string, updateStudentDto: UpdateStudentDto) {
  //     return this.prisma.student.update({
  //       where: { email: email },
  //       data: updateStudentDto,
  //     });
  //   }

  remove(id: string) {
    return this.prisma.student.delete({ where: { id: id } });
  }
}
