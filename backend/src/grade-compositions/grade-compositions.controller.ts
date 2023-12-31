import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateGradeCompositionDto,
  FinalizeGradeCompositionDto,
} from './dto/create-grade-composition.dto';
import { UpdateAllStudentGradeDto } from './dto/update-all-student-grade.dto';
import { UpdateGradeCompositionDto } from './dto/update-grade-composition.dto';
import { GradeCompositionEntity } from './entities/grade-composition.entity';
import { GradeCompositionsService } from './grade-compositions.service';

@Controller('grade-compositions')
@ApiTags('grade-compositions')
export class GradeCompositionsController {
  constructor(
    private readonly gradeCompositionsService: GradeCompositionsService,
  ) {}

  @Patch(':id/finalize')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  finalizeGradeComposition(
    @Param('id') gradeCompositionId: string,
    @Body() dto: FinalizeGradeCompositionDto,
  ) {
    return this.gradeCompositionsService.finalizeGradeComposition(
      gradeCompositionId,
      dto.teacherId,
    );
  }

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
