import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-tokens.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginResponse } from './swagger_types/login-type';
import { RefreshResponse } from './swagger_types/refresh-type';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiCreatedResponse({ type: LoginResponse })
  @ApiBadRequestResponse()
  async login(@Body() userDto: LoginDto) {
    return this.authService.login(userDto);
  }

  @Post('/register')
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async register(@Body() userDto: SignupDto) {
    return this.authService.register(userDto);
  }

  @Post('refresh')
  @ApiCreatedResponse({ type: RefreshResponse })
  @ApiBadRequestResponse()
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }
}
