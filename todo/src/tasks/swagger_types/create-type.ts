import { ApiProperty } from '@nestjs/swagger';

export class CreateTask {
  @ApiProperty({ default: 1 })
  id: number;

  @ApiProperty({ default: 'First task' })
  name: string;

  @ApiProperty()
  description: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ default: 1 })
  columnId: number;

  @ApiProperty({ default: 0 })
  position: number;
}
