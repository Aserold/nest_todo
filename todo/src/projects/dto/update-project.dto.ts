import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateProjectDto {
  @ApiPropertyOptional({ default: 'My Project' })
  @IsOptional()
  @IsString()
  @Length(3, 64)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(3, 255)
  description?: string;
}
