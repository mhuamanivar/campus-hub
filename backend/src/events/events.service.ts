import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventQueryDto } from './dto/event-query.dto';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async findAll(query: EventQueryDto, userId?: string) {
    const { search, category, sortBy = 'date', cursor, limit = 20 } = query;

    const where = {
      isCancelled: false,
      isPublished: true,
      ...(category && { category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
          { location: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const orderBy =
      sortBy === 'title'    ? { title: 'asc' as const } :
      sortBy === 'capacity' ? { capacity: 'desc' as const } :
                              { date: 'asc' as const };

    const events = await this.prisma.event.findMany({
      where,
      orderBy,
      take: limit,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      include: {
        _count: { select: { registrations: true } },
        organizer: { select: { name: true, email: true } },
        ...(userId && {
          registrations: { where: { userId }, select: { qrToken: true } },
        }),
      },
    });

    return events.map((e) => this.shape(e, userId));
  }

  async findOne(id: string, userId?: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        _count: { select: { registrations: true } },
        organizer: { select: { name: true, email: true } },
        ...(userId && {
          registrations: { where: { userId }, select: { qrToken: true } },
        }),
      },
    });
    if (!event) throw new NotFoundException('Evento no encontrado');
    return this.shape(event, userId);
  }

  async create(dto: CreateEventDto, organizerId: string) {
    const event = await this.prisma.event.create({
      data: {
        ...dto,
        date: new Date(dto.date),
        organizerId,
      },
      include: {
        _count: { select: { registrations: true } },
        organizer: { select: { name: true, email: true } },
      },
    });
    return this.shape(event, organizerId);
  }

  async update(id: string, dto: UpdateEventDto, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Evento no encontrado');
    if (event.organizerId !== userId) throw new ForbiddenException('No tienes permiso para editar este evento');

    const updated = await this.prisma.event.update({
      where: { id },
      data: { ...dto, ...(dto.date && { date: new Date(dto.date) }) },
      include: {
        _count: { select: { registrations: true } },
        organizer: { select: { name: true, email: true } },
        registrations: { where: { userId }, select: { qrToken: true } },
      },
    });
    return this.shape(updated, userId);
  }

  async remove(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Evento no encontrado');
    if (event.organizerId !== userId) throw new ForbiddenException('No tienes permiso para eliminar este evento');

    await this.prisma.event.update({ where: { id }, data: { isCancelled: true } });
  }

  async register(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } },
    });
    if (!event) throw new NotFoundException('Evento no encontrado');
    if (event.isCancelled) throw new BadRequestException('El evento fue cancelado');

    const alreadyRegistered = await this.prisma.eventRegistration.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });
    if (alreadyRegistered) throw new ConflictException('Ya estás inscrito en este evento');

    if (event._count.registrations >= event.capacity) {
      throw new BadRequestException('No hay cupos disponibles');
    }

    const qrToken = sign(
      { eventId, userId, type: 'qr-checkin' },
      this.config.get<string>('jwt.qrSecret') || 'dev-qr-secret',
      { expiresIn: (this.config.get<string>('jwt.qrExpiresIn') || '30d') as unknown as number },
    );

    const registration = await this.prisma.eventRegistration.create({
      data: { eventId, userId, qrToken },
    });

    return { qrToken: registration.qrToken };
  }

  async unregister(eventId: string, userId: string) {
    const registration = await this.prisma.eventRegistration.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });
    if (!registration) throw new NotFoundException('No estás inscrito en este evento');

    await this.prisma.eventRegistration.delete({
      where: { eventId_userId: { eventId, userId } },
    });
  }

  async getRegistration(eventId: string, userId: string) {
    const registration = await this.prisma.eventRegistration.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });
    if (!registration) return { isRegistered: false };
    return { isRegistered: true, qrToken: registration.qrToken };
  }

  private shape(
    event: {
      id: string;
      title: string;
      description: string;
      category: string;
      date: Date;
      location: string;
      capacity: number;
      imageUrl: string | null;
      isPublished: boolean;
      isCancelled: boolean;
      organizerId: string;
      createdAt: Date;
      updatedAt: Date;
      _count: { registrations: number };
      organizer: { name: string; email: string };
      registrations?: { qrToken: string }[];
    },
    userId?: string,
  ) {
    const isRegistered = userId ? (event.registrations?.length ?? 0) > 0 : false;
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date,
      location: event.location,
      capacity: event.capacity,
      imageUrl: event.imageUrl,
      registrationCount: event._count.registrations,
      organizerName: event.organizer.name,
      organizerEmail: event.organizer.email,
      isCancelled: event.isCancelled,
      isRegistered,
      qrToken: isRegistered ? event.registrations![0].qrToken : undefined,
      createdAt: event.createdAt,
    };
  }
}
