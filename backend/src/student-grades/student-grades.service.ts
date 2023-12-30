import { Injectable } from '@nestjs/common';
import { CreateStudentGradeDto } from './dto/create-student-grade.dto';
import { UpdateStudentGradeDto } from './dto/update-student-grade.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClassesService } from 'src/classes/classes.service';

@Injectable()
export class StudentGradesService {
  constructor(private prisma: PrismaService) {}
  async findStudentGrade(studentId: string, gradeCompositionId: string) {
    return this.prisma.studentGrade.findUnique({
      where: {
        Unique_GradeComposition_Student: {
          studentId: studentId,
          gradeCompositionId: gradeCompositionId,
        },
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
  async updateOneStudentGrade(
    studentGradeId: string,
    classId: string,
    grade: number,
  ) {
    const studentGrade = await this.prisma.studentGrade.update({
      where: { id: studentGradeId },
      data: { grade: grade },
    });
    const totalGrade = await this.calculateStudenTotalGrade(
      classId,
      studentGrade.studentId,
    );
    return { studentGrade, totalGrade };
  }

  async create(createStudentGradeDto: CreateStudentGradeDto) {
    try {
      const studentGradeData: any = {
        grade: createStudentGradeDto.grade,
        gradeCompositionId: createStudentGradeDto.gradeCompositionId,
        studentId: createStudentGradeDto.studentId,
      };

      if (createStudentGradeDto.gradeReviewId) {
        studentGradeData.gradeReview = {
          connect: { id: createStudentGradeDto.gradeReviewId },
        };
      }

      const newStudentGrade = await this.prisma.studentGrade.create({
        data: studentGradeData,
      });

      return newStudentGrade;
    } catch (error) {
      // Custom error handling/logging/reporting
      throw new Error(`Failed to create student grade: ${error.message}`);
    }
  }

  findAll() {
    return this.prisma.studentGrade.findMany({});
  }

  findOne(id: string) {
    return this.prisma.studentGrade.findUnique({ where: { id: id } });
  }

  async update(id: string, updateStudentGradeDto: UpdateStudentGradeDto) {
    try {
      const studentGradeData: any = {
        grade: updateStudentGradeDto.grade,
        gradeCompositionId: updateStudentGradeDto.gradeCompositionId,
        studentId: updateStudentGradeDto.studentId,
      };

      //TODO: check other CRUD update methods for uncessary throws
      if (updateStudentGradeDto.gradeReviewId) {
        studentGradeData.gradeReview = {
          connect: { id: updateStudentGradeDto.gradeReviewId },
        };
      }

      const newStudentGrade = await this.prisma.studentGrade.update({
        where: { id: id },
        data: studentGradeData,
      });

      return newStudentGrade;
    } catch (error) {
      // Custom error handling/logging/reporting
      throw new Error(`Failed to create student grade: ${error.message}`);
    }
  }

  remove(id: string) {
    return this.prisma.studentGrade.delete({ where: { id: id } });
  }
}
