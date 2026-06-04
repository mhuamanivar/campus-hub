import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoanDto, CreateResourceDto, UpdateLoanDto } from './dto/loan.dto';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async getResources() {
    return this.prisma.resource.findMany({
      where: { isAvailable: true },
      orderBy: { name: 'asc' },
    });
  }

  async createResource(dto: CreateResourceDto) {
    return this.prisma.resource.create({ data: dto });
  }

  async requestLoan(dto: CreateLoanDto, borrowerId: string) {
    const resource = await this.prisma.resource.findUnique({ where: { id: dto.resourceId } });
    if (!resource) throw new NotFoundException('Recurso no encontrado');
    if (!resource.isAvailable) throw new BadRequestException('El recurso no está disponible');

    const loan = await this.prisma.loan.create({
      data: {
        resourceId: dto.resourceId,
        borrowerId,
        dueDate: new Date(dto.dueDate),
        notes: dto.notes,
      },
      include: { resource: true, borrower: { select: { name: true, email: true } } },
    });

    await this.prisma.resource.update({ where: { id: dto.resourceId }, data: { isAvailable: false } });

    return loan;
  }

  async getMyLoans(userId: string) {
    return this.prisma.loan.findMany({
      where: { borrowerId: userId },
      include: {
        resource: true,
        lender: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllLoans() {
    return this.prisma.loan.findMany({
      include: {
        resource: true,
        borrower: { select: { name: true, email: true } },
        lender: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateLoan(id: string, dto: UpdateLoanDto, userId: string) {
    const loan = await this.prisma.loan.findUnique({ where: { id } });
    if (!loan) throw new NotFoundException('Préstamo no encontrado');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== 'ADMIN' && loan.borrowerId !== userId) throw new ForbiddenException();

    const updated = await this.prisma.loan.update({ where: { id }, data: { status: dto.status } });

    // Free up resource when returned
    if (dto.status === 'RETURNED' || dto.status === 'CANCELLED') {
      await this.prisma.loan.update({ where: { id }, data: { returnedAt: new Date() } });
      await this.prisma.resource.update({ where: { id: loan.resourceId }, data: { isAvailable: true } });
    }

    return updated;
  }
}
