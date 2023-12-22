import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { exclude } from 'src/users/users.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

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

    classWithGradeCompositions.gradeCompositions.forEach((gradeComposition) => {
      gradeComposition.studentGrades.forEach((studentGrade) => {
        const studentId = studentGrade.studentId;
        if (!studentGradesByStudent[studentId]) {
          studentGradesByStudent[studentId] = {
            studentId: studentGrade.studentId,
            gradeEntries: [],
          };
        }
        const gradeCompositionX = exclude(gradeComposition, ['studentGrades']);
        const studentGradeX = exclude(studentGrade, ['studentId']);
        studentGradesByStudent[studentId].gradeEntries.push({
          ...gradeCompositionX,
          ...studentGradeX,
        });
      });
    });

    return Object.values(studentGradesByStudent);
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
          },
        },
      },
    });
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
    ]);

    const [
      fetchedGradeCompositions,
      fetchedClassTeachers,
      fetchedClassInvitationForTeachers,
      fetchedClassMembers,
      fetchedClassInvitationForStudents,
    ] = batchedFetch;
    console.log(createClassDto.classTeachers);
    console.log(fetchedClassTeachers);
    return this.prisma.class.create({
      data: {
        name: createClassDto.name,
        description: createClassDto.description,
        code: createClassDto.code,
        invitationLink: createClassDto.invitationLink,
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
