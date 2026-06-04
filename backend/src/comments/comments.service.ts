import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async findByEvent(eventId: string) {
    const comments = await this.prisma.comment.findMany({
      where: { eventId, parentId: null },
      include: {
        user: { select: { name: true, avatarUrl: true } },
        replies: {
          include: { user: { select: { name: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return comments.map((c) => this.shape(c));
  }

  async create(eventId: string, userId: string, dto: CreateCommentDto) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Evento no encontrado');

    if (dto.parentId) {
      const parent = await this.prisma.comment.findUnique({ where: { id: dto.parentId } });
      if (!parent) throw new NotFoundException('Comentario padre no encontrado');
    }

    const comment = await this.prisma.comment.create({
      data: { body: dto.body, eventId, userId, parentId: dto.parentId },
      include: {
        user: { select: { name: true, avatarUrl: true } },
        replies: { include: { user: { select: { name: true, avatarUrl: true } } } },
      },
    });

    return this.shape(comment);
  }

  async remove(id: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comentario no encontrado');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (comment.userId !== userId && user?.role !== 'ADMIN') {
      throw new ForbiddenException('No puedes eliminar este comentario');
    }

    await this.prisma.comment.delete({ where: { id } });
  }

  private shape(comment: {
    id: string;
    body: string;
    userId: string;
    parentId: string | null;
    createdAt: Date;
    user: { name: string; avatarUrl: string | null };
    replies?: {
      id: string;
      body: string;
      userId: string;
      parentId: string | null;
      createdAt: Date;
      user: { name: string; avatarUrl: string | null };
    }[];
  }) {
    return {
      id: comment.id,
      body: comment.body,
      userId: comment.userId,
      userName: comment.user.name,
      userAvatar: comment.user.avatarUrl,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
      replies: (comment.replies ?? []).map((r) => ({
        id: r.id,
        body: r.body,
        userId: r.userId,
        userName: r.user.name,
        userAvatar: r.user.avatarUrl,
        parentId: r.parentId,
        createdAt: r.createdAt,
        replies: [],
      })),
    };
  }
}
