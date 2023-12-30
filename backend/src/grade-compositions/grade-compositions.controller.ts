import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { GradeCompositionsService } from './grade-compositions.service';
import { CreateGradeCompositionDto } from './dto/create-grade-composition.dto';
import { UpdateGradeCompositionDto } from './dto/update-grade-composition.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GradeCompositionEntity } from './entities/grade-composition.entity';
import { UpdateAllStudentGradeDto } from './dto/update-all-student-grade.dto';

@Controller('grade-compositions')
@ApiTags('grade-compositions')
export class GradeCompositionsController {
  constructor(
    private readonly gradeCompositionsService: GradeCompositionsService,
  ) {}
  @Patch(':id/updateAllStudentGrades/:classId')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  updateAllStudentGrades(
    @Param('id') gradeCompositionId: string,
    @Param('classId') classId: string,
    @Body() updateAllStudentGradeDto: UpdateAllStudentGradeDto,
  ) {
    return this.gradeCompositionsService.updateAllStudentGrades(
      gradeCompositionId,
      classId,
      updateAllStudentGradeDto,
    );
  }

  @Get(':id/getStudentsGrade')
  @ApiOkResponse({ type: GradeCompositionEntity })
  @HttpCode(HttpStatus.OK)
  getStudentsGrade(@Param('id') id: string) {
    return this.gradeCompositionsService.getStudentsGrade(id);
  }

  @Get(':id/populate-student-grade')
  @ApiOkResponse({ type: GradeCompositionEntity })
  @HttpCode(HttpStatus.OK)
  populateStudentGrade(@Param('id') id: string) {
    return this.gradeCompositionsService.populateStudentGrade(id);
  }

  @Post()
  @ApiCreatedResponse({ type: GradeCompositionEntity })
  @HttpCode(HttpStatus.OK)
  create(@Body() createGradeCompositionDto: CreateGradeCompositionDto) {
    return this.gradeCompositionsService.create(createGradeCompositionDto);
  }

  @Get()
  @ApiOkResponse({ type: GradeCompositionEntity })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.gradeCompositionsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: GradeCompositionEntity })
  findOne(@Param('id') id: string) {
    return this.gradeCompositionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: GradeCompositionEntity })
  update(
    @Param('id') id: string,
    @Body() updateGradeCompositionDto: UpdateGradeCompositionDto,
  ) {
    return this.gradeCompositionsService.update(id, updateGradeCompositionDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: GradeCompositionEntity })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.gradeCompositionsService.remove(id);
  }
}
