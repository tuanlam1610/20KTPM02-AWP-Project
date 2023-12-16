import { Test, TestingModule } from '@nestjs/testing';
import { GradeCompositionsController } from './grade-compositions.controller';
import { GradeCompositionsService } from './grade-compositions.service';

describe('GradeCompositionsController', () => {
  let controller: GradeCompositionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GradeCompositionsController],
      providers: [GradeCompositionsService],
    }).compile();

    controller = module.get<GradeCompositionsController>(GradeCompositionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
