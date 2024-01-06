import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}
  async getAllClassesOfTeacher(teacherId: string) {
    const classesOfTeacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        classTeacher: {
          where: { class: { isActive: true } },
          select: {
            class: {
              select: {
                id: true,
                name: true,
                description: true,
                code: true,
              },
            },
          },
        },
      },
    });
    return (
      classesOfTeacher?.classTeacher?.map((ct) => ({
        id: ct.class.id,
        name: ct.class.name,
        description: ct.class.description,
        code: ct.class.code,
      })) || []
    );
  }

  async create(createTeacherDto: CreateTeacherDto) {
    const batchedFetch = await Promise.all([
      createTeacherDto.classTeacher
        ? this.prisma.class.findMany({
            where: { id: { in: createTeacherDto.classTeacher } },
          })
        : [],
      createTeacherDto.classInvitationForTeacher
        ? this.prisma.class.findMany({
            where: {
              id: { in: createTeacherDto.classInvitationForTeacher },
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
          create: fetchedClassTeacher.map((ct) => ({
            class: { connect: { id: ct.id } },
          })),
        },
        classInvitationForTeacher: {
          create: fetchedClassInvitationForTeacher.map((cift) => ({
            class: {
              connect: { id: cift.id },
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
    return this.prisma.teacher.findMany();
  }

  findOne(id: string) {
    return this.prisma.teacher.findUnique({ where: { id: id } });
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    const batchedFetch = await Promise.all([
      updateTeacherDto.classTeacher
        ? this.prisma.class.findMany({
            where: { id: { in: updateTeacherDto.classTeacher } },
          })
        : [],
      updateTeacherDto.classInvitationForTeacher
        ? this.prisma.class.findMany({
            where: {
              id: { in: updateTeacherDto.classInvitationForTeacher },
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
          create: fetchedClassTeacher.map((ct) => ({
            class: { connect: { id: ct.id } },
          })),
        },
        classInvitationForTeacher: {
          create: fetchedClassInvitationForTeacher.map((cift) => ({
            class: {
              connect: { id: cift.id },
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
    return this.prisma.teacher.delete({ where: { id: id } });
  }
}
