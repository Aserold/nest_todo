import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
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
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable } from 'rxjs';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  @Post('/login')
  @ApiCreatedResponse({ type: LoginResponse })
  @ApiBadRequestResponse()
  login(@Body() userDto: LoginDto): Observable<LoginResponse> {
    return this.client.send('login', userDto).pipe(
      catchError((err) => {
        console.log(err);
        throw new BadRequestException(err.message);
      }),
    );
  }

  @Post('/register')
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  register(@Body() userDto: SignupDto) {
    return this.client.send('register_user', userDto).pipe(
      catchError((err) => {
        console.log(err);
        throw new BadRequestException(err.message);
      }),
    );
  }

  @Post('/refresh')
  @ApiCreatedResponse({ type: RefreshResponse })
  @ApiBadRequestResponse()
  refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Observable<RefreshResponse> {
    return this.client.send('refresh_token', refreshTokenDto).pipe(
      catchError((err) => {
        console.log(err);
        throw new BadRequestException(err.message);
      }),
    );
  }
}
