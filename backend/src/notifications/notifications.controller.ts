import { Controller, Get, Patch, Param, Query } from '@nestjs/common';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class NotifQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50) limit?: number;
}

interface AuthUser { id: string }

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser, @Query() query: NotifQueryDto) {
    return this.notificationsService.findAll(user.id, query.limit);
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser() user: AuthUser) {
    return this.notificationsService.getUnreadCount(user.id);
  }

  @Patch('read-all')
  markAllRead(@CurrentUser() user: AuthUser) {
    return this.notificationsService.markAllRead(user.id);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.notificationsService.markRead(id, user.id);
  }
}
