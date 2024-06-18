import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateColumnDto {
  @ApiProperty({ default: 1 })
  @IsInt()
  projectId: number;

  @ApiProperty({ default: 'todo' })
  @IsString()
  @MaxLength(64)
  name: string;
}
