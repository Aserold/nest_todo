import { ApiProperty } from '@nestjs/swagger';

export class CreateColumn {
  @ApiProperty({ default: 1 })
  id: number;

  @ApiProperty({ default: 'todo' })
  name: string;

  @ApiProperty({ default: 0 })
  position: number;

  @ApiProperty({ default: 1 })
  projectId: number;
}
