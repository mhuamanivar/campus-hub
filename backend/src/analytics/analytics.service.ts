import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EVENT_CATEGORY_LABEL } from './category-labels';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [
      totalEvents,
      totalRegistrations,
      totalUsers,
      totalServices,
      totalProducts,
      totalAttendances,
    ] = await Promise.all([
      this.prisma.event.count({ where: { isCancelled: false } }),
      this.prisma.eventRegistration.count(),
      this.prisma.user.count(),
      this.prisma.service.count({ where: { isActive: true } }),
      this.prisma.product.count({ where: { isAvailable: true } }),
      this.prisma.attendanceRecord.count(),
    ]);

    const attendanceRate =
      totalRegistrations > 0
        ? Math.round((totalAttendances / totalRegistrations) * 100)
        : 0;

    return {
      totalEvents,
      totalRegistrations,
      totalUsers,
      totalServices,
      totalProducts,
      totalAttendances,
      attendanceRate,
    };
  }

  async getPopularEvents(limit = 5) {
    const events = await this.prisma.event.findMany({
      where: { isCancelled: false },
      include: { _count: { select: { registrations: true } } },
      orderBy: { registrations: { _count: 'desc' } },
      take: limit,
    });

    return events.map((e) => ({
      id: e.id,
      title: e.title,
      category: e.category,
      categoryLabel: EVENT_CATEGORY_LABEL[e.category] ?? e.category,
      date: e.date,
      registrationCount: e._count.registrations,
    }));
  }

  async getByCategory() {
    const grouped = await this.prisma.eventRegistration.groupBy({
      by: ['eventId'],
      _count: { eventId: true },
    });

    const eventIds = grouped.map((g) => g.eventId);
    const events = await this.prisma.event.findMany({
      where: { id: { in: eventIds } },
      select: { id: true, category: true },
    });

    const categoryMap: Record<string, number> = {};
    grouped.forEach((g) => {
      const event = events.find((e) => e.id === g.eventId);
      if (event) {
        const label = EVENT_CATEGORY_LABEL[event.category] ?? event.category;
        categoryMap[label] = (categoryMap[label] || 0) + g._count.eventId;
      }
    });

    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  }

  async getEventDistribution() {
    const grouped = await this.prisma.event.groupBy({
      by: ['category'],
      where: { isCancelled: false },
      _count: { category: true },
    });

    return grouped.map((g) => ({
      name: EVENT_CATEGORY_LABEL[g.category] ?? g.category,
      value: g._count.category,
    }));
  }
}
