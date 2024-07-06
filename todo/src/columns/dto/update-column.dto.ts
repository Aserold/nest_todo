import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class UpdateColumnDto {
  @ApiProperty({ default: 'Todo' })
  @IsString()
  @MaxLength(64)
  name: string;
}
