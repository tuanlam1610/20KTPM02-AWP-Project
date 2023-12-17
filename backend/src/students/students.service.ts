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
        ...createStudentDto,

        studentGrade: {
          //TEST: Grade might be missing
          create: fetchedStudentGrade.map((sg) => ({
            gradeComposition: { connect: { id: sg.id } },
            grade: 0,
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
            grade: sg.grade,
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
