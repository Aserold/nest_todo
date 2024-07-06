import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class MoveTaskDto {
  @ApiProperty()
  @IsInt()
  newPosition: number;

  @ApiProperty()
  @IsInt()
  columnId: number;
}
