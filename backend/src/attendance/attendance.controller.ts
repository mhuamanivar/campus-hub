import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CheckinDto } from './dto/checkin.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

interface AuthUser { id: string }

@Controller()
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('attendance/checkin')
  @HttpCode(HttpStatus.OK)
  checkin(@Body() dto: CheckinDto, @CurrentUser() user: AuthUser) {
    return this.attendanceService.checkin(dto.qrToken, user.id);
  }

  @Get('events/:id/attendance')
  getEventAttendance(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.attendanceService.getEventAttendance(id, user.id);
  }
}
