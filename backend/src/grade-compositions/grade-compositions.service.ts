import { Injectable } from '@nestjs/common';
import { CreateGradeCompositionDto } from './dto/create-grade-composition.dto';
import { UpdateGradeCompositionDto } from './dto/update-grade-composition.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GradeCompositionsService {
  constructor(private prisma: PrismaService) {}

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

    await this.prisma.gradeComposition.update({
      where: { id: gradeCompositionId },
      data: { studentGrades: { create: studentGradesToCreate } },
    });
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

  remove(id: string) {
    return this.prisma.gradeComposition.delete({ where: { id } });
  }
}
