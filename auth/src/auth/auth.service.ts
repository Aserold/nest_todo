import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from 'src/database/database.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    private prisma: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async login(loginData: LoginDto) {
    const { email, password } = loginData;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new RpcException('Invalid login or password');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new RpcException('Invalid login or password');
    }

    const tokens = await this.generateUserToken(user.id);

    return {
      ...tokens,
      userId: user.id,
    };
  }

  async register(signupData: SignupDto) {
    const { email, password } = signupData;

    const emailInUse = await this.prisma.user.findUnique({
      where: { email },
    });
    if (emailInUse) {
      throw new RpcException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    await this.prisma.user.create({
      data: { ...signupData, password: hashedPassword },
    });
    return { message: 'Registration successful' };
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
        expiryDate: { gt: new Date() },
      },
    });

    if (!token) {
      throw new RpcException('Invalid token');
    }

    return this.generateUserToken(token.userId);
  }

  async generateUserToken(userId: number) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' });
    const refreshToken: string = uuidv4();

    await this.storeRefreshToken(refreshToken, userId);
    return {
      accessToken,
      refreshToken,
    };
  }

  async storeRefreshToken(token: string, userId: number) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.prisma.refreshToken.upsert({
      where: { userId },
      update: {
        expiryDate,
        token,
      },
      create: {
        token: token,
        userId: userId,
        expiryDate: expiryDate,
      },
    });
  }
}
