import { ApiProperty } from '@nestjs/swagger';

export class JoinClassDto {
  @ApiProperty()
  code: string;
}

export class MapUserDto {
  @ApiProperty()
  userId: string;
}

export class BulkMappingDto {
  users: {
    userId: string;
    studentId: string;
  }[];
}
