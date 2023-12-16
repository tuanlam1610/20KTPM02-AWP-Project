import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentDto } from './dto/create-students.dto';
import { UpdateStudentDto } from './dto/update-students.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}
  //CRUD
  async create(createStudentDto: CreateStudentDto) {
    // Fetch StudentGrade by their IDs
    // Batch fetch related entities
    const batchedFetch = await Promise.all([
      createStudentDto.classMember
        ? this.prisma.classMember.findMany({
            where: { studentId: { in: createStudentDto.classMember } },
          })
        : [],
      createStudentDto.classInvitationForStudent
        ? this.prisma.classInvitationForStudent.findMany({
            where: {
              studentId: { in: createStudentDto.classInvitationForStudent },
            },
          })
        : [],
      createStudentDto.studentGrade
        ? this.prisma.studentGrade.findMany({
            where: {
              id: { in: createStudentDto.studentGrade },
            },
          })
        : [],
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
        ...createStudentDto,
        studentGrade: {
          connect: fetchedStudentGrade.map((sg) => ({ id: sg.id })),
        },
        gradeReview: {
          connect: fetchedGradeReview.map((gr) => ({
            id: gr.id,
          })),
        },

        classMember: {
          connect: fetchedClassMember.map((cm) => ({
            classId_studentId: {
              studentId: cm.studentId,
              classId: cm.classId,
            },
          })),
        },
        classInvitationForStudent: {
          connect: fetchedClassInvitationForStudent.map((cifs) => ({
            classId_studentId: {
              studentId: cifs.studentId,
              classId: cifs.classId,
            },
          })),
        },
      },
    });
  }

  findOneByUserId(userId: string) {
    return this.prisma.student.findUnique({ where: { userId: userId } });
  }

  findAll() {
    return this.prisma.student.findMany();
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
        ? this.prisma.classMember.findMany({
            where: { studentId: { in: updateStudentDto.classMember } },
          })
        : [],
      updateStudentDto.classInvitationForStudent
        ? this.prisma.classInvitationForStudent.findMany({
            where: {
              studentId: { in: updateStudentDto.classInvitationForStudent },
            },
          })
        : [],
      updateStudentDto.studentGrade
        ? this.prisma.studentGrade.findMany({
            where: {
              id: { in: updateStudentDto.studentGrade },
            },
          })
        : [],
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
          connect: fetchedStudentGrade.map((sg) => ({ id: sg.id })),
        },
        gradeReview: {
          connect: fetchedGradeReview.map((gr) => ({
            id: gr.id,
          })),
        },
        classMember: {
          connect: fetchedClassMember.map((cm) => ({
            classId_studentId: {
              studentId: cm.studentId,
              classId: cm.classId,
            },
          })),
        },
        classInvitationForStudent: {
          connect: fetchedClassInvitationForStudent.map((cifs) => ({
            classId_studentId: {
              studentId: cifs.studentId,
              classId: cifs.classId,
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
