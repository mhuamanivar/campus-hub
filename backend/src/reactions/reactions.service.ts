import { Injectable, NotFoundException } from '@nestjs/common';
import { ReactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReactionsService {
  constructor(private prisma: PrismaService) {}

  async getReactions(eventId: string, userId?: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Evento no encontrado');

    const reactions = await this.prisma.reaction.groupBy({
      by: ['type'],
      where: { eventId },
      _count: { type: true },
    });

    const counts: Record<string, number> = {
      LIKE: 0, HEART: 0, FIRE: 0, CLAP: 0,
    };
    reactions.forEach((r) => { counts[r.type] = r._count.type; });

    let userReaction: string | null = null;
    if (userId) {
      const existing = await this.prisma.reaction.findFirst({
        where: { eventId, userId },
        select: { type: true },
      });
      userReaction = existing?.type ?? null;
    }

    return { counts, userReaction };
  }

  async toggleReaction(eventId: string, userId: string, type: ReactionType) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Evento no encontrado');

    const existing = await this.prisma.reaction.findUnique({
      where: { eventId_userId_type: { eventId, userId, type } },
    });

    if (existing) {
      await this.prisma.reaction.delete({
        where: { eventId_userId_type: { eventId, userId, type } },
      });
      return { toggled: 'removed', type };
    }

    // Remove any other reaction from this user on this event first (one reaction per user)
    await this.prisma.reaction.deleteMany({ where: { eventId, userId } });

    await this.prisma.reaction.create({ data: { eventId, userId, type } });
    return { toggled: 'added', type };
  }
}
