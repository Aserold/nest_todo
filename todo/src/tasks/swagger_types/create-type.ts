import { ApiProperty } from '@nestjs/swagger';
import { Field } from 'src/fields/swagger_types/field-type';

export class CreateTask {
  @ApiProperty({ default: 1 })
  id: number;

  @ApiProperty({ default: 'First task' })
  name: string;

  @ApiProperty()
  description: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ default: 1 })
  columnId: number;

  @ApiProperty({ default: 0 })
  position: number;

  @ApiProperty({ type: [Field] })
  fieldValues: Field[];
}
