import { Controller, Get, Patch, Put, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto, UpdateInterestsDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: { id: string }) {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: { id: string }, @Body() dto: UpdateProfileDto) {
    return this.usersService.update(user.id, dto);
  }

  @Put('me/interests')
  updateInterests(@CurrentUser() user: { id: string }, @Body() dto: UpdateInterestsDto) {
    return this.usersService.updateInterests(user.id, dto);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
