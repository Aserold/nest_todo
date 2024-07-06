import { ApiProperty } from '@nestjs/swagger';
import { FieldType } from '@prisma/client';

export class Field {
  @ApiProperty({ default: 1 })
  id: number;

  @ApiProperty({ default: 1 })
  projectId: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: FieldType })
  fieldType: FieldType;
}
