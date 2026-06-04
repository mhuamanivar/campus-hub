import {
  Injectable,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';

interface QrPayload {
  eventId: string;
  userId: string;
  type: string;
}

@Injectable()
export class AttendanceService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async checkin(qrToken: string, scannedById: string) {
    let payload: QrPayload;
    try {
      payload = verify(
        qrToken,
        this.config.get<string>('jwt.qrSecret') || 'dev-qr-secret',
      ) as QrPayload;
    } catch {
      throw new BadRequestException('Código QR inválido o expirado');
    }

    if (payload.type !== 'qr-checkin') {
      throw new BadRequestException('Código QR inválido');
    }

    const { eventId, userId } = payload;

    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Evento no encontrado');
    if (event.isCancelled) throw new BadRequestException('El evento fue cancelado');

    const registration = await this.prisma.eventRegistration.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });
    if (!registration) throw new BadRequestException('El usuario no está inscrito en este evento');

    const existing = await this.prisma.attendanceRecord.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });
    if (existing) throw new ConflictException('Este asistente ya fue registrado');

    await this.prisma.attendanceRecord.create({
      data: { eventId, userId, scannedById },
    });

    const attendee = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, career: true },
    });

    return {
      message: 'Asistencia registrada exitosamente',
      attendee: { name: attendee!.name, email: attendee!.email, career: attendee!.career },
      event: { title: event.title, date: event.date },
    };
  }

  async getEventAttendance(eventId: string, requesterId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Evento no encontrado');

    const requester = await this.prisma.user.findUnique({ where: { id: requesterId } });
    if (event.organizerId !== requesterId && requester?.role !== 'ADMIN') {
      throw new ForbiddenException('Solo el organizador puede ver la asistencia');
    }

    const records = await this.prisma.attendanceRecord.findMany({
      where: { eventId },
      include: {
        user: { select: { name: true, email: true, career: true } },
      },
      orderBy: { scannedAt: 'desc' },
    });

    return records.map((r) => ({
      id: r.id,
      attendee: { name: r.user.name, email: r.user.email, career: r.user.career },
      scannedAt: r.scannedAt,
    }));
  }
}
