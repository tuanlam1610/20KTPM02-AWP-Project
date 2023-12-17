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
  create(@Body() createUserDto: CreateStudentDto) {
    return this.studentsService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({ type: StudentEntity })
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: StudentEntity })
  async findOne(@Param('id') id: string) {
    const user = await this.studentsService.findOne(id);

    if (!user) {
      throw new NotFoundException(`Could not find students with ${id}.`);
    }
    return user;
  }

  @Patch(':id')
  @ApiOkResponse({ type: StudentEntity })
  update(@Param('id') id: string, @Body() updateStudentDto: CreateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: StudentEntity })
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
