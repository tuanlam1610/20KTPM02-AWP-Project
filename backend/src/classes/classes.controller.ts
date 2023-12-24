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
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/enum/roles.enum';
import { TotalGradeDto } from './dto/total-grade.dto';
import { GradeComposition } from '@prisma/client';
import { CreateGradeCompositionDto } from 'src/grade-compositions/dto/create-grade-composition.dto';

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
