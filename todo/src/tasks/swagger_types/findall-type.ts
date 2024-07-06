import { ApiProperty } from '@nestjs/swagger';

export class FindallTasks {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  columnId: number;

  @ApiProperty()
  position: number;
}
