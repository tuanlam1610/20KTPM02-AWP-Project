import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateStudentDto } from './dto/create-students.dto';
import { StudentEntity } from './entities/student.entity';
import { PopulateClassDto } from 'src/classes/dto/class-populate.dto';
import { BulkMappingDto, JoinClassDto, MapUserDto } from './dto/join-class.dto';
import { UpdateStudentDto } from './dto/update-students.dto';
enum GradeReviewStatusFilter {
  Open = 'Open',
  Accepted = 'Accepted',
  Denied = 'Denied',
  All = 'All',
}
@Controller('students')
@ApiTags('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // @UseGuards(AuthGuard('jwt'))
  // @Get('getUserProfile')
  // @ApiBearerAuth('jwt')
  // @HttpCode(HttpStatus.OK)
  // findUserByAT(@Req() req: any) {
  //   const user = req.user;
  //   return this.studentsService.findOne(user['sub']);
  // }
  @Get('unmapped')
  @ApiOkResponse({ type: StudentEntity })
  @HttpCode(HttpStatus.OK)
  getUnmappedStudents() {
    return this.studentsService.getUnmappedStudents();
  }

  @Get(':id/GradeReview')
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
    @Query('page', new DefaultValuePipe('0')) page?: string,
    @Query('limit', new DefaultValuePipe('10')) limit?: string,
  ) {
    return this.studentsService.getStudentGradeReview(
      id,
      +page,
      +limit,
      status,
    );
  }

  @ApiOkResponse({ type: StudentEntity })
  @Get(':id/getAllClassesOfstudent/')
  @ApiOkResponse({ type: StudentEntity })
  @HttpCode(HttpStatus.OK)
  getAllClassesOfStudent(@Param('id') id: string) {
    return this.studentsService.getAllClassesOfStudent(id);
  }

  @Patch(':id/joinClassByCode')
  @ApiOkResponse({ type: StudentEntity })
  @HttpCode(HttpStatus.OK)
  joinClassByCode(@Param('id') id: string, @Body() body: JoinClassDto) {
    return this.studentsService.joinClassByCode(body.code, id);
  }

  @Patch(':id/mapStudentToUser')
  @ApiOkResponse({ type: StudentEntity })
  @HttpCode(HttpStatus.OK)
  mapStudentToUser(@Param('id') id: string, @Body() body: MapUserDto) {
    return this.studentsService.mapStudentToUser(id, body.userId);
  }

  @Patch('mapMultipleStudentToUser')
  @ApiOkResponse({ type: StudentEntity })
  @HttpCode(HttpStatus.OK)
  mapMultipleStudentToUser(@Body() body: BulkMappingDto) {
    return this.studentsService.mapMultipleStudentToUser(body);
  }

  @Post('populateStudents')
  @ApiCreatedResponse({ type: StudentEntity })
  @HttpCode(HttpStatus.OK)
  populateStudents(@Body() PopulateClassDto: PopulateClassDto) {
    return this.studentsService.populateStudents(PopulateClassDto);
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
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: StudentEntity })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
