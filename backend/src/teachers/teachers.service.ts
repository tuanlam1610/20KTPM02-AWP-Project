import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}
  async create(createTeacherDto: CreateTeacherDto) {
    const batchedFetch = await Promise.all([
      createTeacherDto.classTeacher
        ? this.prisma.classTeacher.findMany({
            where: { teacherId: { in: createTeacherDto.classTeacher } },
          })
        : [],
      createTeacherDto.classInvitationForTeacher
        ? this.prisma.classInvitationForTeacher.findMany({
            where: {
              teacherId: { in: createTeacherDto.classInvitationForTeacher },
            },
          })
        : [],
      createTeacherDto.gradeReview
        ? this.prisma.gradeReview.findMany({
            where: { id: { in: createTeacherDto.gradeReview } },
          })
        : [],
    ]);

    const [
      fetchedClassTeacher,
      fetchedClassInvitationForTeacher,
      fetchedGradeReview,
    ] = batchedFetch;

    return this.prisma.teacher.create({
      data: {
        ...createTeacherDto,
        classTeacher: {
          connect: fetchedClassTeacher.map((ct) => ({
            classId_teacherId: {
              teacherId: ct.teacherId,
              classId: ct.classId,
            },
          })),
        },
        classInvitationForTeacher: {
          connect: fetchedClassInvitationForTeacher.map((cifs) => ({
            classId_teacherId: {
              teacherId: cifs.teacherId,
              classId: cifs.classId,
            },
          })),
        },

        gradeReview: {
          connect: fetchedGradeReview.map((gr) => ({
            id: gr.id,
          })),
        },
      },
    });
  }

  findAll() {
    return this.prisma.student.findMany();
  }

  findOne(id: string) {
    return this.prisma.student.findUnique({ where: { id: id } });
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    const batchedFetch = await Promise.all([
      updateTeacherDto.classTeacher
        ? this.prisma.classTeacher.findMany({
            where: { teacherId: { in: updateTeacherDto.classTeacher } },
          })
        : [],
      updateTeacherDto.classInvitationForTeacher
        ? this.prisma.classInvitationForTeacher.findMany({
            where: {
              teacherId: { in: updateTeacherDto.classInvitationForTeacher },
            },
          })
        : [],
      updateTeacherDto.gradeReview
        ? this.prisma.gradeReview.findMany({
            where: { id: { in: updateTeacherDto.gradeReview } },
          })
        : [],
    ]);

    const [
      fetchedClassTeacher,
      fetchedClassInvitationForTeacher,
      fetchedGradeReview,
    ] = batchedFetch;

    return this.prisma.teacher.update({
      where: { id }, // Use the provided teacher ID for updating
      data: {
        ...updateTeacherDto,
        classTeacher: {
          connect: fetchedClassTeacher.map((ct) => ({
            classId_teacherId: {
              teacherId: ct.teacherId,
              classId: ct.classId,
            },
          })),
        },
        classInvitationForTeacher: {
          connect: fetchedClassInvitationForTeacher.map((cifs) => ({
            classId_teacherId: {
              teacherId: cifs.teacherId,
              classId: cifs.classId,
            },
          })),
        },
        gradeReview: {
          connect: fetchedGradeReview.map((gr) => ({
            id: gr.id,
          })),
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.student.delete({ where: { id: id } });
  }
}
