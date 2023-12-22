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
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('teachers')
@ApiTags('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get(':id/getAllClasses')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  getAllClasses(@Param('id') id: string) {
    return this.teachersService.getAllClassesOfTeacher(id);
  }

  @Post()
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.create(createTeacherDto);
  }

  @Get()
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.teachersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teachersService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.teachersService.remove(id);
  }
}
