import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

interface GoogleProfile {
  providerUserId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('El correo ya está registrado');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        career: dto.career,
        interests: {
          create: dto.interests.map((interest) => ({ interest })),
        },
      },
      include: { interests: true },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens, user: this.sanitizeUser(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { interests: true },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) throw new UnauthorizedException('Credenciales inválidas');

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens, user: this.sanitizeUser(user) };
  }

  async refresh(userId: string, refreshToken: string): Promise<TokenPair> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const tokenMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!tokenMatch) throw new UnauthorizedException();

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async googleLogin(profile: GoogleProfile) {
    if (!this.config.get<string>('google.clientId')) {
      throw new BadRequestException('Google OAuth no está configurado');
    }

    let user = await this.prisma.user.findUnique({ where: { email: profile.email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          career: '',
          avatarUrl: profile.avatarUrl,
          oauthAccounts: {
            create: { provider: 'google', providerUserId: profile.providerUserId },
          },
        },
        include: { interests: true },
      });
    } else {
      const existingOAuth = await this.prisma.oAuthAccount.findUnique({
        where: {
          provider_providerUserId: {
            provider: 'google',
            providerUserId: profile.providerUserId,
          },
        },
      });
      if (!existingOAuth) {
        await this.prisma.oAuthAccount.create({
          data: { userId: user.id, provider: 'google', providerUserId: profile.providerUserId },
        });
      }
    }

    const userWithInterests = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { interests: true },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens, user: this.sanitizeUser(userWithInterests!) };
  }

  private async generateTokens(userId: string, email: string, role: string): Promise<TokenPair> {
    const payload = { sub: userId, email, role };

    const sign = (secret: string, expiresIn: string) =>
      this.jwtService.signAsync(payload, {
        secret,
        expiresIn: expiresIn as unknown as number,
      });

    const [accessToken, refreshToken] = await Promise.all([
      sign(
        this.config.get<string>('jwt.secret') || 'dev-secret',
        this.config.get<string>('jwt.expiresIn') || '15m',
      ),
      sign(
        this.config.get<string>('jwt.refreshSecret') || 'dev-refresh-secret',
        this.config.get<string>('jwt.refreshExpiresIn') || '7d',
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hash },
    });
  }

  private sanitizeUser(user: {
    id: string;
    email: string;
    name: string;
    career: string;
    bio: string | null;
    avatarUrl: string | null;
    role: string;
    interests?: { interest: string }[];
  }) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      career: user.career,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      role: user.role,
      interests: (user.interests ?? []).map((i) => i.interest),
    };
  }
}
