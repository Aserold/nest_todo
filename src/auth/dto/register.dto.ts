import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({ description: 'user email', default: 'example@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'user password', default: 'yourpassword1' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*\d).+$/, {
    message: 'В пароле должно быть как минимум одно число',
  })
  password: string;
}
