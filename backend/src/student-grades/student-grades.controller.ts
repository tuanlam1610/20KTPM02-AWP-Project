import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StudentGradesService } from './student-grades.service';
import { CreateStudentGradeDto } from './dto/create-student-grade.dto';
import { UpdateStudentGradeDto } from './dto/update-student-grade.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('student-grades')
@ApiTags('student-grades')
export class StudentGradesController {
  constructor(private readonly studentGradesService: StudentGradesService) {}

  @Post()
  create(@Body() createStudentGradeDto: CreateStudentGradeDto) {
    return this.studentGradesService.create(createStudentGradeDto);
  }

  @Get()
  findAll() {
    return this.studentGradesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentGradesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStudentGradeDto: UpdateStudentGradeDto,
  ) {
    return this.studentGradesService.update(id, updateStudentGradeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentGradesService.remove(id);
  }
}
