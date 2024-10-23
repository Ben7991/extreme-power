import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountStatus } from '@prisma/client';
import { compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

import { UserRepository } from 'src/database/repository/user.repository';
import { User } from 'src/shared/types/user.type';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private configService: ConfigService,
  ) {}

  async login(username: string, pass: string) {
    const existingUser = await this.userRepo.find(username);
    const hashedPassword = existingUser ? existingUser.password : '';
    const samePassword = await compare(pass, hashedPassword);

    if (
      !existingUser ||
      !samePassword ||
      existingUser.status === AccountStatus.SUSPENDED
    ) {
      throw new BadRequestException('Invalid login credentails');
    }

    return {
      message: 'You are successfully logged-in',
      token: this.generateAuthToken(existingUser),
      user: {
        id: existingUser.id,
        name: existingUser.name,
        username: existingUser.username,
        role: existingUser.role,
      },
    };
  }

  private generateAuthToken(user: User) {
    const secretKey = this.configService.get<string>('secretKey');

    const refreshToken = sign(
      { sub: user.id, username: user.username },
      secretKey,
      { expiresIn: '30days' },
    );

    const accessToken = sign({ sub: refreshToken }, secretKey, {
      expiresIn: '15mins',
    });

    return { refreshToken, accessToken };
  }

  async refreshToken(refreshToken: string) {
    const secretKey = this.configService.get<string>('secretKey');

    try {
      const result = <{ sub: string; username: string }>(
        verify(refreshToken, secretKey)
      );

      const existingUser = await this.userRepo.find(result.username);

      if (!existingUser) {
        throw new Error();
      }

      return this.generateAuthToken(existingUser);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
