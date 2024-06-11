import { IsOptional, IsString, Length } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @Length(3, 64)
  name: string;

  @IsOptional()
  @IsString()
  @Length(3, 255)
  description?: string;
}
