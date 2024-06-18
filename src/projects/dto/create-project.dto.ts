import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ default: 'My project' })
  @IsString()
  @Length(3, 64)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(3, 255)
  description?: string;
}
