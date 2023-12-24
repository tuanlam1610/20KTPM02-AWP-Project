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
import { GradeReviewsService } from './grade-reviews.service';
import { CreateGradeReviewDto } from './dto/create-grade-review.dto';
import { UpdateGradeReviewDto } from './dto/update-grade-review.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('grade-reviews')
@ApiTags('Grade-Reviews')
export class GradeReviewsController {
  constructor(private readonly gradeReviewsService: GradeReviewsService) {}

  @Get(':id/details')
  @ApiOkResponse({ type: CreateGradeReviewDto })
  @HttpCode(HttpStatus.OK)
  getGradeReviewDetails(@Param('id') id: string) {
    return this.gradeReviewsService.getGradeReviewDetails(id);
  }

  @Post()
  @ApiCreatedResponse({ type: CreateGradeReviewDto })
  @HttpCode(HttpStatus.OK)
  create(@Body() createGradeReviewDto: CreateGradeReviewDto) {
    return this.gradeReviewsService.create(createGradeReviewDto);
  }

  @Get()
  @ApiOkResponse({ type: CreateGradeReviewDto })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.gradeReviewsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: CreateGradeReviewDto })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.gradeReviewsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: CreateGradeReviewDto })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateGradeReviewDto: UpdateGradeReviewDto,
  ) {
    return this.gradeReviewsService.update(id, updateGradeReviewDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: CreateGradeReviewDto })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.gradeReviewsService.remove(id);
  }
}
