import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class FieldValueDto {
  @ApiProperty({ default: 1 })
  @IsInt()
  fieldId: number;

  @ApiPropertyOptional({})
  @IsOptional()
  @IsString()
  stringValue?: string;

  @ApiPropertyOptional({})
  @IsOptional()
  @IsInt()
  numberValue?: number;
}

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

  @ApiPropertyOptional({ type: [FieldValueDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FieldValueDto)
  fieldValues: FieldValueDto[];
}
