import { ApiProperty } from '@nestjs/swagger';

export class Create {
  @ApiProperty({ default: 1 })
  id: number;

  @ApiProperty({ default: 'My project' })
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ default: 1 })
  userId: number;
}
