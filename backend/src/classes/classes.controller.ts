import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/enum/roles.enum';
import { TotalGradeDto } from './dto/total-grade.dto';
import { GradeComposition, GradeReviewStatus } from '@prisma/client';
import { CreateGradeCompositionDto } from 'src/grade-compositions/dto/create-grade-composition.dto';
import { PopulateClassDto } from './dto/class-populate.dto';

enum GradeReviewStatusFilter {
  Open = 'Open',
  Approved = 'Approved',
  Denied = 'Denied',
  All = 'All',
}
@Controller('classes')
@ApiTags('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Patch(':id/updateGradeCompositionOrder')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  updateGradeCompositionOrder(
    @Param('id') classId: string,
    @Body() gradeCompositionsDto: GradeComposition[],
  ) {
    return this.classesService.updateGradeCompositionOrder(
      classId,
      gradeCompositionsDto,
    );
  }

  @Patch(':id/updateStudentTotalGrade')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  updateStudentTotalGrade(
    @Param('id') classId: string,
    @Body() totalGradeDto: TotalGradeDto,
  ) {
    return this.classesService.updateStudentTotalGrade(
      classId,
      totalGradeDto.studentId,
      totalGradeDto.totalGrade,
    );
  }

  @Get(':id/getStudentsTeachers')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  getAllStudentsTeachers(@Param('id') id: string) {
    return this.classesService.getClassStudentsTeachers(id);
  }

  @Get(':id/getGradeReview')
  @ApiOkResponse()
  @ApiQuery({
    name: 'status',
    required: false,
    enum: GradeReviewStatusFilter,
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getGradeReview(
    @Param('id') id: string,
    @Query('status')
    status?: GradeReviewStatusFilter,
    @Query('page', new DefaultValuePipe('1')) page?: string,
    @Query('limit', new DefaultValuePipe('10')) limit?: string,
  ) {
    return this.classesService.getAllClassGradeReview(
      id,
      +page,
      +limit,
      status,
    );
  }

  @Get(':id/getGradeStructure')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  getGradeStructure(@Param('id') id: string) {
    return this.classesService.getAllGradeCompositionsOfClass(id);
  }

  @Get(':id/getAllGradesOfStudent')
  @ApiCreatedResponse()
  @HttpCode(HttpStatus.OK)
  getAllGradesOfStudent(@Param('id') id: string) {
    return this.classesService.getStudentGradesByClass(id);
  }

  @Post(':id/populateClassStudents')
  @ApiCreatedResponse()
  @HttpCode(HttpStatus.OK)
  populateClassStudents(
    @Param('id') id: string,
    @Body() body: PopulateClassDto,
  ) {
    return this.classesService.populateClassWithStudentsList(body, id);
  }

  @Post()
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.classesService.remove(id);
  }
}
