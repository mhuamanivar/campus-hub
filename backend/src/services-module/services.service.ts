import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto, RequestServiceDto } from './dto/create-service.dto';
import { ServiceQueryDto } from './dto/service-query.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ServiceQueryDto, requesterId?: string) {
    const { search, category, mine } = query;
    const where = {
      isActive: true,
      ...(mine && requesterId ? { ownerId: requesterId } : {}),
      ...(category ? { category } : {}),
      ...(search ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      } : {}),
    };

    const services = await this.prisma.service.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true } },
        ratings: { select: { score: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return services.map((s) => this.shape(s));
  }

  async create(dto: CreateServiceDto, ownerId: string) {
    const service = await this.prisma.service.create({
      data: { ...dto, ownerId },
      include: { owner: { select: { id: true, name: true } }, ratings: { select: { score: true } } },
    });
    return this.shape(service);
  }

  async update(id: string, dto: UpdateServiceDto, userId: string) {
    const s = await this.prisma.service.findUnique({ where: { id } });
    if (!s) throw new NotFoundException('Servicio no encontrado');
    if (s.ownerId !== userId) throw new ForbiddenException();
    const updated = await this.prisma.service.update({
      where: { id },
      data: dto,
      include: { owner: { select: { id: true, name: true } }, ratings: { select: { score: true } } },
    });
    return this.shape(updated);
  }

  async remove(id: string, userId: string) {
    const s = await this.prisma.service.findUnique({ where: { id } });
    if (!s) throw new NotFoundException('Servicio no encontrado');
    if (s.ownerId !== userId) throw new ForbiddenException();
    await this.prisma.service.update({ where: { id }, data: { isActive: false } });
  }

  async createRequest(serviceId: string, requesterId: string, dto: RequestServiceDto) {
    const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new NotFoundException('Servicio no encontrado');

    const request = await this.prisma.serviceRequest.create({
      data: { serviceId, requesterId, message: dto.message },
      include: { service: { select: { title: true } } },
    });

    await this.prisma.notification.create({
      data: {
        userId: service.ownerId,
        type: 'SERVICE_REQUEST',
        title: 'Nueva solicitud de servicio',
        body: `Alguien está interesado en "${service.title}"`,
        data: { serviceId, requestId: request.id },
      },
    });

    return request;
  }

  async getMyRequests(userId: string) {
    return this.prisma.serviceRequest.findMany({
      where: { OR: [{ requesterId: userId }, { service: { ownerId: userId } }] },
      include: {
        service: { select: { title: true, price: true, priceType: true } },
        requester: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private shape(s: {
    id: string; title: string; description: string; category: string; price: number;
    priceType: string; isActive: boolean; ownerId: string; createdAt: Date;
    owner: { id: string; name: string }; ratings: { score: number }[];
  }) {
    const avg = s.ratings.length > 0
      ? s.ratings.reduce((sum, r) => sum + r.score, 0) / s.ratings.length : 0;
    return {
      id: s.id, title: s.title, description: s.description, category: s.category,
      price: s.price, priceType: s.priceType, isActive: s.isActive,
      ownerId: s.ownerId, ownerName: s.owner.name,
      rating: Math.round(avg * 10) / 10, reviewCount: s.ratings.length,
      createdAt: s.createdAt,
    };
  }
}
