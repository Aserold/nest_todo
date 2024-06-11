import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*\d).+$/, {
    message: 'В пароле должно быть как минимум одно число',
  })
  password: string;
}
