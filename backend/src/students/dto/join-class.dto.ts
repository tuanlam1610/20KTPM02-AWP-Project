import { ApiProperty } from '@nestjs/swagger';

export class JoinClassDto {
  @ApiProperty()
  code: string;
}

export class MapUserDto {
  @ApiProperty()
  userId: string;
}
