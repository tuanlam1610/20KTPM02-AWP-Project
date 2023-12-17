import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateStudentDto } from './dto/create-students.dto';
import { StudentEntity } from './entities/student.entity';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('getUserProfile')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  findUserByAT(@Req() req: any) {
    const user = req.user;
    return this.studentsService.findOne(user['sub']);
  }

  @Post()
  @ApiCreatedResponse({ type: StudentEntity })
  @HttpCode(HttpStatus.OK)
  create(@Body() createUserDto: CreateStudentDto) {
    return this.studentsService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({ type: StudentEntity })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: StudentEntity })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const user = await this.studentsService.findOne(id);

    if (!user) {
      throw new NotFoundException(`Could not find students with ${id}.`);
    }
    return user;
  }

  @Patch(':id')
  @ApiOkResponse({ type: StudentEntity })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateStudentDto: CreateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: StudentEntity })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
