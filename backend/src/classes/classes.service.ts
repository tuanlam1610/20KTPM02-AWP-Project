import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { exclude } from 'src/users/users.service';
import { GradeComposition, Prisma } from '@prisma/client';
import { CreateGradeCompositionDto } from 'src/grade-compositions/dto/create-grade-composition.dto';
import { PopulateClassDto } from './dto/class-populate.dto';

enum GradeReviewStatusFilter {
  open = 'open',
  approved = 'approved',
  denied = 'denied',
  all = 'all',
}

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async getClassStudentsTeachers(classId: string) {
    const fetchedStudentsTeachers = await this.prisma.class.findUnique({
      where: { id: classId },
      select: {
        classMember: {
          select: {
            student: {
              select: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        classTeacher: {
          select: {
            teacher: {
              select: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return {
      userStudents: fetchedStudentsTeachers.classMember.map(
        (cm) => cm.student.user,
      ),
      userTeachers: fetchedStudentsTeachers.classTeacher.map(
        (ct) => ct.teacher.user,
      ),
    };
  }

  async updateGradeCompositionOrder(
    classId: string,
    gradeCompositions: GradeComposition[],
  ) {
    await this.prisma.$transaction(async (prisma) => {
      // Separate existing and new grade compositions
      const existingCompositions = [];
      const newCompositions = [];

      for (const composition of gradeCompositions) {
        if (composition.id) {
          existingCompositions.push(composition);
        } else {
          newCompositions.push(composition);
        }
      }

      await Promise.all(
        existingCompositions.map(async (composition) => {
          await prisma.gradeComposition.update({
            where: { id: composition.id },
            data: {
              name: composition.name,
              percentage: composition.percentage,
              rank: composition.rank,
              isFinalized: composition.isFinalized,
            },
          });
        }),
      );

      // Create new grade compositions within the transaction
      await prisma.gradeComposition.createMany({
        data: newCompositions.map((composition) => ({
          name: composition.name,
          percentage: composition.percentage,
          rank: composition.rank,
          classId: classId,
          isFinalized: composition.isFinalized,
          // Add other fields here based on your 'composition' object.
        })),
      });
    });
    return 'Successfully updated grade compositions';
  }

  async updateStudentTotalGrade(
    classId: string,
    studentId: string,
    grade: number,
  ) {
    return this.prisma.classMember.update({
      where: { classId_studentId: { classId: classId, studentId: studentId } },
      data: {
        totalGrade: grade,
      },
    });
  }

  async getStudentGradesByClass(classId: string) {
    const classWithGradeCompositions = await this.prisma.class.findUnique({
      where: { id: classId },
      include: {
        gradeCompositions: {
          select: {
            id: true,
            name: true,
            percentage: true,
            studentGrades: {
              select: {
                id: true,
                grade: true,
                studentId: true,
              },
            },
          },
        },
      },
    });
    const studentGradesByStudent: Record<string, any> = {};

    for (const gradeComposition of classWithGradeCompositions.gradeCompositions) {
      for (const studentGrade of gradeComposition.studentGrades) {
        const studentId = studentGrade.studentId;
        if (!studentGradesByStudent[studentId]) {
          const totalGrade = await this.prisma.classMember.findUnique({
            where: {
              classId_studentId: { classId: classId, studentId: studentId },
            },
            select: {
              student: {
                select: {
                  name: true,
                },
              },
              totalGrade: true,
            },
          });
          if (totalGrade === null) {
            continue;
          }
          studentGradesByStudent[studentId] = {
            studentId: studentGrade.studentId,
            name: totalGrade.student.name,
            totalGrade: totalGrade.totalGrade,
            gradeEntries: [],
          };
        }
        const gradeCompositionX = exclude(gradeComposition, ['studentGrades']);
        const studentGradeX = exclude(studentGrade, ['studentId']);
        studentGradesByStudent[studentId].gradeEntries.push({
          ...gradeCompositionX,
          ...studentGradeX,
        });
      }
    }
    return Object.values(studentGradesByStudent);
  }

  async getAllClassGradeReview(
    classId: string,
    page?: number,
    limit?: number,
    status?: GradeReviewStatusFilter,
  ) {
    const where: Prisma.GradeReviewWhereInput = {};
    if (status !== GradeReviewStatusFilter.all) {
      where.status = status;
    }

    return this.prisma.class.findUnique({
      where: { id: classId, gradeReviews: { some: {} } },
      select: {
        gradeReviews: {
          where: { ...where },
          skip: page ?? 0,
          take: limit ?? 10,
          orderBy: { status: 'asc' },
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
        },
      },
    });
  }

  async getAllGradeCompositionsOfClass(classId: string) {
    return this.prisma.class.findUnique({
      where: { id: classId },
      select: {
        id: true,
        name: true,
        description: true,
        code: true,
        gradeCompositions: {
          select: {
            id: true,
            name: true,
            percentage: true,
            rank: true,
            isFinalized: true,
          },
        },
      },
    });
  }

  async populateClassWithStudentsList(
    studentsList: PopulateClassDto,
    classId: string,
  ) {
    const students = studentsList.students;

    try {
      const classMembers = await Promise.all(
        students.map(async (student) => {
          // Create or update the classMember relationship for each student
          const classMember = await this.prisma.classMember.upsert({
            where: {
              classId_studentId: {
                classId: classId,
                studentId: student.studentId,
              },
            },
            update: {},
            create: {
              class: { connect: { id: classId } },
              student: {
                connect: { id: student.studentId },
                create: { name: student.name },
              },
            },
          });
          return classMember;
        }),
      );

      return classMembers;
    } catch (error) {
      // Handle errors
      throw new Error(
        `Failed to populate class with students: ${error.message}`,
      );
    }
  }

  async create(createClassDto: CreateClassDto) {
    if (!createClassDto.invitationLink) {
      createClassDto.invitationLink = 'https://meet.google.com/lookup/abc123';
    }
    if (!createClassDto.code) {
      createClassDto.code = 'abc123';
    }

    // Fetch GradeCompositions by their IDs
    // Batch fetch related entities
    const batchedFetch = await Promise.all([
      createClassDto.gradeCompositions
        ? this.prisma.gradeComposition.findMany({
            where: { id: { in: createClassDto.gradeCompositions } },
          })
        : [],
      createClassDto.classTeachers
        ? this.prisma.teacher.findMany({
            where: { id: { in: createClassDto.classTeachers } },
          })
        : [],
      createClassDto.classInvitationForTeachers
        ? this.prisma.teacher.findMany({
            where: {
              id: { in: createClassDto.classInvitationForTeachers },
            },
          })
        : [],
      createClassDto.classMembers
        ? this.prisma.student.findMany({
            where: { id: { in: createClassDto.classMembers } },
          })
        : [],
      createClassDto.classInvitationForStudents
        ? this.prisma.student.findMany({
            where: {
              id: { in: createClassDto.classInvitationForStudents },
            },
          })
        : [],
      createClassDto.gradeReviews
        ? this.prisma.gradeReview.findMany({
            where: {
              id: { in: createClassDto.gradeReviews },
            },
          })
        : [],
    ]);

    const [
      fetchedGradeCompositions,
      fetchedClassTeachers,
      fetchedClassInvitationForTeachers,
      fetchedClassMembers,
      fetchedClassInvitationForStudents,
      fetchedGradeReviews,
    ] = batchedFetch;

    return this.prisma.class.create({
      data: {
        name: createClassDto.name,
        description: createClassDto.description,
        code: createClassDto.code,
        invitationLink: createClassDto.invitationLink,
        gradeCompositions: {
          connect: fetchedGradeCompositions.map((gc) => ({ id: gc.id })),
        },
        classOwnerId: createClassDto.classOwnerId,
        //TODO rework all tehse connection.
        classTeacher: {
          create: fetchedClassTeachers.map((ct) => ({
            teacher: { connect: { id: ct.id } },
          })),
        },
        classInvitationForTeacher: {
          create: fetchedClassInvitationForTeachers.map((cit) => ({
            invitedTeacher: { connect: { id: cit.id } },
          })),
        },
        classMember: {
          create: fetchedClassMembers.map((cm) => ({
            student: { connect: { id: cm.id } },
          })),
        },
        classInvitationForStudent: {
          create: fetchedClassInvitationForStudents.map((cifs) => ({
            invitedStudent: {
              connect: { id: cifs.id },
            },
          })),
        },
        gradeReviews: {
          connect: fetchedGradeReviews.map((gr) => ({
            id: gr.id,
          })),
        },
      },
    });
  }
  findAll() {
    return this.prisma.class.findMany();
  }

  findOne(id: string) {
    return this.prisma.class.findUnique({ where: { id: id } });
  }

  async update(id: string, updateClassDto: UpdateClassDto) {
    // Fetch GradeCompositions by their IDs
    // Fetch GradeCompositions by their IDs
    // Batch fetch related entities
    const batchedFetch = await Promise.all([
      updateClassDto.gradeCompositions
        ? this.prisma.gradeComposition.findMany({
            where: { id: { in: updateClassDto.gradeCompositions } },
          })
        : [],
      updateClassDto.classTeachers
        ? this.prisma.teacher.findMany({
            where: { id: { in: updateClassDto.classTeachers } },
          })
        : [],
      updateClassDto.classInvitationForTeachers
        ? this.prisma.teacher.findMany({
            where: {
              id: { in: updateClassDto.classInvitationForTeachers },
            },
          })
        : [],
      updateClassDto.classMembers
        ? this.prisma.student.findMany({
            where: { id: { in: updateClassDto.classMembers } },
          })
        : [],
      updateClassDto.classInvitationForStudents
        ? this.prisma.student.findMany({
            where: {
              id: { in: updateClassDto.classInvitationForStudents },
            },
          })
        : [],
      updateClassDto.gradeReviews
        ? this.prisma.student.findMany({
            where: {
              id: { in: updateClassDto.classInvitationForStudents },
            },
          })
        : [],
    ]);

    const [
      fetchedGradeCompositions,
      fetchedClassTeachers,
      fetchedClassInvitationForTeachers,
      fetchedClassMembers,
      fetchedClassInvitationForStudents,
    ] = batchedFetch;

    console.log(updateClassDto.classTeachers, id);
    console.log(fetchedClassTeachers);
    return this.prisma.class.update({
      where: { id: id },
      data: {
        name: updateClassDto.name,
        description: updateClassDto.description,
        code: updateClassDto.code,
        invitationLink: updateClassDto.invitationLink,
        classOwnerId: updateClassDto.classOwnerId,
        gradeCompositions: {
          connect: fetchedGradeCompositions.map((gc) => ({ id: gc.id })),
        },
        //TODO rework all tehse connection.
        classTeacher: {
          create: fetchedClassTeachers.map((ct) => ({
            teacher: { connect: { id: ct.id } },
          })),
        },
        classInvitationForTeacher: {
          create: fetchedClassInvitationForTeachers.map((cit) => ({
            invitedTeacher: { connect: { id: cit.id } },
          })),
        },
        classMember: {
          create: fetchedClassMembers.map((cm) => ({
            student: { connect: { id: cm.id } },
          })),
        },
        classInvitationForStudent: {
          create: fetchedClassInvitationForStudents.map((cifs) => ({
            invitedStudent: {
              connect: { id: cifs.id },
            },
          })),
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.class.delete({ where: { id: id } });
  }
}
