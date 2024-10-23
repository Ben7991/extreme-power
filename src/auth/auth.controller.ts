import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(
      loginDto.username,
      loginDto.password,
    );

    this.setAuthCookie(res, result.token);

    return {
      message: result.message,
      data: result.user,
    };
  }

  private setAuthCookie(
    res: Response,
    token: { refreshToken: string; accessToken: string },
  ) {
    const refreshTokenDuration = 1000 * 60 * 60 * 24 * 30;

    res.cookie('_ref-tk', token.refreshToken, {
      path: '/',
      httpOnly: true,
      maxAge: refreshTokenDuration,
    });

    res.cookie('_acc-tk', token.accessToken, {
      path: '/',
      httpOnly: true,
      maxAge: refreshTokenDuration,
    });
  }

  @Get('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = <string>req.cookies['_ref-tk'];
    const result = await this.authService.refreshToken(refreshToken);
    this.setAuthCookie(res, result);

    return { message: 'Refreshed token' };
  }
}
