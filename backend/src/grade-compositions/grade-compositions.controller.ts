import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GradeCompositionsService } from './grade-compositions.service';
import { CreateGradeCompositionDto } from './dto/create-grade-composition.dto';
import { UpdateGradeCompositionDto } from './dto/update-grade-composition.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('grade-compositions')
@ApiTags('grade-compositions')
export class GradeCompositionsController {
  constructor(
    private readonly gradeCompositionsService: GradeCompositionsService,
  ) {}

  @Post()
  create(@Body() createGradeCompositionDto: CreateGradeCompositionDto) {
    return this.gradeCompositionsService.create(createGradeCompositionDto);
  }

  @Get()
  findAll() {
    return this.gradeCompositionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradeCompositionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGradeCompositionDto: UpdateGradeCompositionDto,
  ) {
    return this.gradeCompositionsService.update(id, updateGradeCompositionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gradeCompositionsService.remove(id);
  }
}
