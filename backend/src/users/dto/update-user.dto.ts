import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ required: false })
  studentId?: string;
  @ApiProperty({ required: false })
  teacherId?: string;
  @ApiProperty({ required: false })
  adminId?: string;
}
