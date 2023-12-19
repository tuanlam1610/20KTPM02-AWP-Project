import { Injectable } from '@nestjs/common';
import { CreateStudentGradeDto } from './dto/create-student-grade.dto';
import { UpdateStudentGradeDto } from './dto/update-student-grade.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentGradesService {
  constructor(private prisma: PrismaService) {}
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
