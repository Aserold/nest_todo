import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'user refresh token', default: 'token' })
  @IsString()
  refreshToken: string;
}