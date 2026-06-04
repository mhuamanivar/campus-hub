import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventQueryDto } from './dto/event-query.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';

interface AuthUser { id: string; email: string; role: string }

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  findAll(@Query() query: EventQueryDto, @CurrentUser() user?: AuthUser) {
    return this.eventsService.findAll(query, user?.id);
  }

  @Post()
  create(@Body() dto: CreateEventDto, @CurrentUser() user: AuthUser) {
    return this.eventsService.create(dto, user.id);
  }

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user?: AuthUser) {
    return this.eventsService.findOne(id, user?.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEventDto, @CurrentUser() user: AuthUser) {
    return this.eventsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.eventsService.remove(id, user.id);
  }

  @Post(':id/register')
  register(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.eventsService.register(id, user.id);
  }

  @Delete(':id/register')
  @HttpCode(HttpStatus.NO_CONTENT)
  unregister(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.eventsService.unregister(id, user.id);
  }

  @Get(':id/registration')
  getRegistration(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.eventsService.getRegistration(id, user.id);
  }
}
