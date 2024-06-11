import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/register.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async login(loginData: LoginDto) {
    const { email, password } = loginData;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Неверные логин или пароль');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Неверные логин или пароль');
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
      throw new BadRequestException('Email уже существует');
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    await this.prisma.user.create({
      data: { ...signupData, password: hashedPassword },
    });
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
        expiryDate: { gt: new Date() },
      },
    });

    if (!token) {
      throw new UnauthorizedException();
    }

    return this.generateUserToken(token.userId);
  }

  async generateUserToken(userId: number) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' });
    const refreshToken = uuidv4();

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
