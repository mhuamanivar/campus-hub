import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto, UpdateInterestsDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { interests: true },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return this.sanitize(user);
  }

  async update(id: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
      include: { interests: true },
    });
    return this.sanitize(user);
  }

  async updateInterests(id: string, dto: UpdateInterestsDto) {
    await this.prisma.userInterest.deleteMany({ where: { userId: id } });

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        interests: {
          create: dto.interests.map((interest) => ({ interest })),
        },
      },
      include: { interests: true },
    });
    return this.sanitize(user);
  }

  private sanitize(user: {
    id: string;
    email: string;
    name: string;
    career: string;
    bio: string | null;
    avatarUrl: string | null;
    role: string;
    createdAt: Date;
    interests: { interest: string }[];
  }) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      career: user.career,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      role: user.role,
      interests: user.interests.map((i) => i.interest),
      createdAt: user.createdAt,
    };
  }
}
