import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';

interface AuthUser { id: string }

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  findAll(@Query() query: ProductQueryDto, @CurrentUser() user?: AuthUser) {
    return this.productsService.findAll(query, user?.id);
  }

  @Get('my')
  findMine(@CurrentUser() user: AuthUser) {
    return this.productsService.findMine(user.id);
  }

  @Post()
  create(@Body() dto: CreateProductDto, @CurrentUser() user: AuthUser) {
    return this.productsService.create(dto, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto, @CurrentUser() user: AuthUser) {
    return this.productsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.productsService.remove(id, user.id);
  }
}
