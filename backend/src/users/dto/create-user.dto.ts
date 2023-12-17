import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty()
  hash: string;

  @ApiProperty({ required: false })
  dob?: Date;

  @ApiProperty()
  roles: string[];

  @ApiProperty({ required: false })
  comment;
}
