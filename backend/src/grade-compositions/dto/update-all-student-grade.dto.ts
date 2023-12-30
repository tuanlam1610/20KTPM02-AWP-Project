import { ApiProperty } from '@nestjs/swagger';

export class studentGradeItem {
  @ApiProperty()
  studentId: string;
  @ApiProperty()
  grade: number;
}

export class UpdateAllStudentGradeDto {
  @ApiProperty({ type: [studentGradeItem] })
  studentGrades: studentGradeItem[];
}
