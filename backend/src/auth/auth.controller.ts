import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.register(dto);
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    return { accessToken, user };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(dto);
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    return { accessToken, user };
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @CurrentUser() user: { id: string; refreshToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refresh(user.id, user.refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
    return { accessToken: tokens.accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: { id: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.id);
    res.clearCookie('refreshToken', { path: '/' });
    return { message: 'Sesión cerrada' };
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    // Guard handles the redirect to Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @Req() req: Request & { user: unknown },
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.googleLogin(
      req.user as Parameters<typeof this.authService.googleLogin>[0],
    );
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(
      `${frontendUrl}/auth/callback?token=${accessToken}&userId=${user.id}`,
    );
  }
}
