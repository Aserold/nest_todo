import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class NewPositionDto {
  @ApiProperty({ default: 1 })
  @IsInt()
  @Min(0)
  newPosition: number;
}
