import { ApiProperty } from '@nestjs/swagger';
import { FieldType } from '@prisma/client';
import { IsEnum, IsInt, IsString, MaxLength } from 'class-validator';

export class CreateFieldDto {
  @ApiProperty({ default: 1 })
  @IsInt()
  projectId: number;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ enum: FieldType })
  @IsEnum(FieldType)
  fieldType: FieldType;
}
