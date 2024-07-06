import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-tokens.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern('login')
  async login(@Payload() userDto: LoginDto) {
    return this.authService.login(userDto);
  }

  @MessagePattern('register_user')
  async register(@Payload() userDto: SignupDto) {
    return this.authService.register(userDto);
  }

  @MessagePattern('refresh_token')
  async refreshTokens(@Payload() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }
}
