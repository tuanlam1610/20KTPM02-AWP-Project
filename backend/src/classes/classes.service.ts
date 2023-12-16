import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

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
        ? this.prisma.classTeacher.findMany({
            where: { teacherId: { in: createClassDto.classTeachers } },
          })
        : [],
      createClassDto.classInvitationForTeachers
        ? this.prisma.classInvitationForTeacher.findMany({
            where: {
              teacherId: { in: createClassDto.classInvitationForTeachers },
            },
          })
        : [],
      createClassDto.classMembers
        ? this.prisma.classMember.findMany({
            where: { studentId: { in: createClassDto.classMembers } },
          })
        : [],
      createClassDto.classInvitationForStudents
        ? this.prisma.classInvitationForStudent.findMany({
            where: {
              studentId: { in: createClassDto.classInvitationForStudents },
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

    return this.prisma.class.create({
      data: {
        name: createClassDto.name,
        description: createClassDto.description,
        code: createClassDto.code,
        invitationLink: createClassDto.invitationLink,
        gradeCompositions: {
          connect: fetchedGradeCompositions.map((gc) => ({ id: gc.id })),
        },
        classTeacher: {
          connect: fetchedClassTeachers.map((ct) => ({
            classId_teacherId: { teacherId: ct.teacherId, classId: ct.classId },
          })),
        },
        classInvitationForTeacher: {
          connect: fetchedClassInvitationForTeachers.map((cit) => ({
            classId_teacherId: {
              teacherId: cit.teacherId,
              classId: cit.classId,
            },
          })),
        },
        classMember: {
          connect: fetchedClassMembers.map((cm) => ({
            classId_studentId: {
              studentId: cm.studentId,
              classId: cm.classId,
            },
          })),
        },
        classInvitationForStudent: {
          connect: fetchedClassInvitationForStudents.map((cifs) => ({
            classId_studentId: {
              studentId: cifs.studentId,
              classId: cifs.classId,
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
        ? this.prisma.classTeacher.findMany({
            where: { teacherId: { in: updateClassDto.classTeachers } },
          })
        : [],
      updateClassDto.classInvitationForTeachers
        ? this.prisma.classInvitationForTeacher.findMany({
            where: {
              teacherId: { in: updateClassDto.classInvitationForTeachers },
            },
          })
        : [],
      updateClassDto.classMembers
        ? this.prisma.classMember.findMany({
            where: { studentId: { in: updateClassDto.classMembers } },
          })
        : [],
      updateClassDto.classInvitationForStudents
        ? this.prisma.classInvitationForStudent.findMany({
            where: {
              studentId: { in: updateClassDto.classInvitationForStudents },
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
        classTeacher: {
          connect: fetchedClassTeachers.map((ct) => ({
            classId_teacherId: { teacherId: ct.teacherId, classId: ct.classId },
          })),
        },
        classInvitationForTeacher: {
          connect: fetchedClassInvitationForTeachers.map((cit) => ({
            classId_teacherId: {
              teacherId: cit.teacherId,
              classId: cit.classId,
            },
          })),
        },
        classMember: {
          connect: fetchedClassMembers.map((cm) => ({
            classId_studentId: {
              studentId: cm.studentId,
              classId: cm.classId,
            },
          })),
        },
        classInvitationForStudent: {
          connect: fetchedClassInvitationForStudents.map((cifs) => ({
            classId_studentId: {
              studentId: cifs.studentId,
              classId: cifs.classId,
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
