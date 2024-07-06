import { ApiProperty } from '@nestjs/swagger';

export class MoveTask {
  @ApiProperty()
  message: string;
}
