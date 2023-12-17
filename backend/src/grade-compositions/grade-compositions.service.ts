import { Injectable } from '@nestjs/common';
import { CreateGradeCompositionDto } from './dto/create-grade-composition.dto';
import { UpdateGradeCompositionDto } from './dto/update-grade-composition.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GradeCompositionsService {
  constructor(private prisma: PrismaService) {}

  async create(createGradeCompositionDto: CreateGradeCompositionDto) {
    try {
      const fetchedClass = await this.prisma.class.findUnique({
        where: { id: createGradeCompositionDto.classId },
      });

      if (!fetchedClass) {
        throw new Error(
          `Class with ID ${createGradeCompositionDto.classId} not found`,
        );
      }

      const fetchedStudentsGrade = await this.prisma.student.findMany({
        where: { id: { in: createGradeCompositionDto.studentGrades } },
      });

      if (
        fetchedStudentsGrade.length !==
        createGradeCompositionDto.studentGrades.length
      ) {
        const notFoundIds = createGradeCompositionDto.studentGrades.filter(
          (sgId) => !fetchedStudentsGrade.some((sg) => sg.id === sgId),
        );
        throw new Error(
          `Student grades with IDs ${notFoundIds.join(', ')} not found`,
        );
      }

      const newGradeComposition = await this.prisma.gradeComposition.create({
        data: {
          name: createGradeCompositionDto.name,
          percentage: createGradeCompositionDto.percentage,
          rank: createGradeCompositionDto.rank,
          isFinalized: createGradeCompositionDto.isFinalized,
          class: { connect: { id: fetchedClass.id } },
          studentGrades: {
            create: fetchedStudentsGrade.map((sg) => ({
              student: { connect: { id: sg.id } },
              grade: 0,
            })),
          },
        },
      });

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
      const existingGradeComposition =
        await this.prisma.gradeComposition.findUnique({
          where: { id },
          include: { class: true, studentGrades: true },
        });

      if (!existingGradeComposition) {
        throw new Error(`Grade composition with ID ${id} not found`);
      }

      const fetchedClass = await this.prisma.class.findUnique({
        where: { id: updateGradeCompositionDto.classId },
      });

      if (!fetchedClass) {
        throw new Error(
          `Class with ID ${updateGradeCompositionDto.classId} not found`,
        );
      }

      const fetchedStudentsGrade = await this.prisma.student.findMany({
        where: { id: { in: updateGradeCompositionDto.studentGrades } },
      });

      if (
        fetchedStudentsGrade.length !==
        updateGradeCompositionDto.studentGrades.length
      ) {
        const notFoundIds = updateGradeCompositionDto.studentGrades.filter(
          (sgId) => !fetchedStudentsGrade.some((sg) => sg.id === sgId),
        );
        throw new Error(
          `Student grades with IDs ${notFoundIds.join(', ')} not found`,
        );
      }

      const updatedGradeComposition = await this.prisma.gradeComposition.update(
        {
          where: { id },
          data: {
            name: updateGradeCompositionDto.name,
            percentage: updateGradeCompositionDto.percentage,
            rank: updateGradeCompositionDto.rank,
            isFinalized: updateGradeCompositionDto.isFinalized,
            class: { connect: { id: fetchedClass.id } },
            studentGrades: {
              //"set"
              create: fetchedStudentsGrade.map((sg) => ({
                student: { connect: { id: sg.id } },
                grade: 0,
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
