import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto, RequestServiceDto } from './dto/create-service.dto';
import { ServiceQueryDto } from './dto/service-query.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';

interface AuthUser { id: string }

@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  findAll(@Query() query: ServiceQueryDto, @CurrentUser() user?: AuthUser) {
    return this.servicesService.findAll(query, user?.id);
  }

  @Get('my/requests')
  getMyRequests(@CurrentUser() user: AuthUser) {
    return this.servicesService.getMyRequests(user.id);
  }

  @Post()
  create(@Body() dto: CreateServiceDto, @CurrentUser() user: AuthUser) {
    return this.servicesService.create(dto, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto, @CurrentUser() user: AuthUser) {
    return this.servicesService.update(id, dto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.servicesService.remove(id, user.id);
  }

  @Post(':id/requests')
  createRequest(@Param('id') id: string, @Body() dto: RequestServiceDto, @CurrentUser() user: AuthUser) {
    return this.servicesService.createRequest(id, user.id, dto);
  }
}
