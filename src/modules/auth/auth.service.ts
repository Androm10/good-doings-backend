import { Inject, Injectable } from '@nestjs/common';
import {
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserService } from 'src/modules/user/user.service';
import { SignupDto } from './dto/signup.dto';
import { comparePassword } from 'src/common/utils/bcrypt';
import { LoginDto } from './dto/login.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async validateUser(id: number) {
    try {
      const user = await this.userService.get(id);
      return user;
    } catch (error) {
      return null;
    }
  }

  async signup(signupDto: SignupDto) {
    if (await this.userService.getByLogin(signupDto.login)) {
      throw new BadRequestException('User with such login already exists');
    }

    return await this.userService.registerUser(signupDto);
  }

  async login(user: LoginDto) {
    const found = await this.userService.getByLogin(user.login);

    if (found?.login != user.login) {
      throw new BadRequestException('Login or password is incorrect');
    }
    if (!comparePassword(user.password, found.password)) {
      throw new BadRequestException('Login or password is incorrect');
    }

    const { accessToken, refreshToken } = await this.generateTokens(found.id);

    return {
      accessToken,
      refreshToken,
      accessExpiresIn: this.configService.get<string>('auth.expiresIn'),
      refreshExpiresIn: this.configService.get<string>('auth.refreshExpiresIn'),
    };
  }

  async grantNewTokens(refreshToken: string, userId: number) {
    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(userId);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      accessExpiresIn: this.configService.get<string>('auth.expiresIn'),
      refreshExpiresIn: this.configService.get<string>('auth.refreshExpiresIn'),
    };
  }

  private async generateTokens(userId: number) {
    const refreshExpiresIn = this.configService.get<number>(
      'auth.refreshExpiresIn',
    );

    const accessToken = this.jwtService.sign(
      {
        userId: userId,
      },
      { secret: this.configService.get('auth.secret') },
    );

    const refreshToken = this.jwtService.sign(
      {
        userId: userId,
        refresh: true,
      },
      {
        secret: this.configService.get('auth.refreshSecret'),
        expiresIn: refreshExpiresIn / 100,
      },
    );

    this.cacheService.set(userId.toString(), refreshToken, refreshExpiresIn);

    return {
      accessToken,
      refreshToken,
    };
  }
}
