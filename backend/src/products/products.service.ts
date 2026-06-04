import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductQueryDto, requesterId?: string) {
    const { search, category, condition } = query;
    const where = {
      isAvailable: true,
      ...(category ? { category } : {}),
      ...(condition ? { condition } : {}),
      ...(search ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      } : {}),
    };

    const products = await this.prisma.product.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true } },
        ratings: { select: { score: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p) => this.shape(p));
  }

  async findMine(ownerId: string) {
    const products = await this.prisma.product.findMany({
      where: { ownerId, isAvailable: true },
      include: { owner: { select: { id: true, name: true } }, ratings: { select: { score: true } } },
    });
    return products.map((p) => this.shape(p));
  }

  async create(dto: CreateProductDto, ownerId: string) {
    const product = await this.prisma.product.create({
      data: { ...dto, ownerId },
      include: { owner: { select: { id: true, name: true } }, ratings: { select: { score: true } } },
    });
    return this.shape(product);
  }

  async update(id: string, dto: UpdateProductDto, userId: string) {
    const p = await this.prisma.product.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Producto no encontrado');
    if (p.ownerId !== userId) throw new ForbiddenException();
    const updated = await this.prisma.product.update({
      where: { id },
      data: dto,
      include: { owner: { select: { id: true, name: true } }, ratings: { select: { score: true } } },
    });
    return this.shape(updated);
  }

  async remove(id: string, userId: string) {
    const p = await this.prisma.product.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Producto no encontrado');
    if (p.ownerId !== userId) throw new ForbiddenException();
    await this.prisma.product.update({ where: { id }, data: { isAvailable: false } });
  }

  private shape(p: {
    id: string; title: string; description: string; category: string;
    price: number; condition: string; imageUrl: string | null;
    isAvailable: boolean; ownerId: string; createdAt: Date;
    owner: { id: string; name: string }; ratings: { score: number }[];
  }) {
    const avg = p.ratings.length > 0
      ? p.ratings.reduce((sum, r) => sum + r.score, 0) / p.ratings.length : 0;
    return {
      id: p.id, title: p.title, description: p.description, category: p.category,
      price: p.price, condition: p.condition, imageUrl: p.imageUrl,
      isAvailable: p.isAvailable, ownerId: p.ownerId, ownerName: p.owner.name,
      rating: Math.round(avg * 10) / 10, reviewCount: p.ratings.length,
      createdAt: p.createdAt,
    };
  }
}
