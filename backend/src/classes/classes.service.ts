import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GradeComposition, Prisma } from '@prisma/client';
import { GradeCompositionsService } from 'src/grade-compositions/grade-compositions.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { exclude } from 'src/users/users.service';
import { PopulateClassDto } from './dto/class-populate.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

enum GradeReviewStatusFilter {
  Open = 'Open',
  Accepted = 'Accepted',
  Denied = 'Denied',
  All = 'All',
}

@Injectable()
export class ClassesService {
  constructor(
    private prisma: PrismaService,
    private gradeCompositionsService: GradeCompositionsService,
  ) {}

  async addUserToClass(classId: string, userId: string) {
    const user = await this.prisma.classInvitationForStudent.delete({
      where: { classId_studentId: { classId: classId, studentId: userId } },
    });
    if (!user) {
      throw new NotFoundException(
        `Invitation for user with id ${userId} not found`,
      );
    }
    return this.prisma.classMember.update({
      where: { classId_studentId: { classId: classId, studentId: userId } },
      data: {
        isJoined: true,
      },
    });
  }

  async getClassStudentsTeachers(classId: string) {
    const fetchedStudentsTeachers = await this.prisma.class.findUnique({
      where: { id: classId },
      select: {
        classMember: {
          select: {
            student: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          where: { isJoined: true },
        },
        classTeacher: {
          select: {
            teacher: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return {
      userStudents: fetchedStudentsTeachers.classMember.map((cm) => cm.student),
      userTeachers: fetchedStudentsTeachers.classTeacher.map(
        (ct) => ct.teacher,
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
  async calculateStudenTotalGrade(classId: string, studentId: string) {
    const studentGrades = await this.prisma.studentGrade.findMany({
      where: {
        studentId: studentId,
        gradeComposition: {
          classId: classId,
        },
      },
      select: {
        grade: true,
        gradeComposition: {
          select: {
            percentage: true,
          },
        },
      },
    });
    const totalGrade =
      studentGrades.reduce((acc, sg) => {
        return acc + sg.grade * (sg.gradeComposition.percentage / 100);
      }, 0) ?? 0;
    return this.prisma.classMember.update({
      where: { classId_studentId: { classId: classId, studentId: studentId } },
      data: {
        totalGrade: totalGrade,
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
    if (!classWithGradeCompositions) {
      throw new NotFoundException(
        `Class id ${classId} not found`,
        // `Class id ${classId} has no grade composition`,
      );
    }

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
    const gcList = classWithGradeCompositions.gradeCompositions.map((gc) =>
      exclude(gc, ['studentGrades']),
    );
    return {
      gradeCompositions: [...gcList],
      students: Object.values(studentGradesByStudent),
    };
  }

  async getAllClassGradeReview(
    classId: string,
    page?: number,
    limit?: number,
    status?: GradeReviewStatusFilter,
  ) {
    const where: Prisma.GradeReviewWhereInput = {};
    if (status !== GradeReviewStatusFilter.All) {
      where.status = status;
    }
    const totalCount = await this.prisma.gradeReview.count({
      where: { classId: classId, ...where }, // Add your additional filters as needed
    });
    const totalRecord = totalCount;
    const totalPage = Math.ceil(totalRecord / (limit ?? 10));
    if (page * limit > totalCount) {
      throw new NotFoundException(
        `Page limit out of bound. Total Page: ${totalPage} `,
      );
    }

    const allGradeReviews = await this.prisma.class.findUnique({
      where: { id: classId, gradeReviews: { some: {} } },
      select: {
        gradeReviews: {
          where: { ...where },
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
        },
      },
    });
    // For total count

    return {
      ...allGradeReviews,
      currentPage: page,
      totalPage: totalPage,
      totalRecord: totalRecord,
    };
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
      const result = await this.prisma.$transaction(async (prisma) => {
        const nonExistentStudents = [];
        console.log(students);
        const classMembers = await Promise.all(
          students.map(async (student) => {
            // Check if the student exists
            const existingStudent = await prisma.student.findUnique({
              where: { id: student.studentId },
            });

            if (!existingStudent) {
              nonExistentStudents.push({
                studentId: student.studentId,
                name: student.name,
              });
              return null; // Skip creating class member for non-existent student
            }
            const inDB = await prisma.classMember.findUnique({
              where: {
                classId_studentId: {
                  studentId: student.studentId,
                  classId: classId,
                },
              },
            });
            if (inDB) {
              nonExistentStudents.push({
                studentId: student.studentId,
                name: student.name,
              });
              return null;
            }

            // Update the class-member relationship for existing students
            const classMember = await prisma.classMember.create({
              data: {
                classId: classId,
                studentId: student.studentId,
              },
            });

            return classMember;
          }),
        );

        const gc = await prisma.gradeComposition.findMany({
          where: { classId: classId },
        });

        gc.map((gc) =>
          this.gradeCompositionsService.populateStudentGrade(gc.id),
        );

        return {
          classMembers: classMembers.filter(Boolean),
          nonExistentStudents,
        };
      });

      return result;
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
