import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'user email', default: 'example@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'user password', default: 'yourpassword1' })
  @IsString()
  password: string;
}
