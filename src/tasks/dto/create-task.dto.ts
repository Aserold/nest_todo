import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ default: 1 })
  @IsInt()
  columnId: number;

  @ApiProperty({ default: 'First task', maxLength: 64 })
  @IsString()
  @MaxLength(64)
  name: string;

  @ApiPropertyOptional({ maxLength: 2048 })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  description?: string;
}
