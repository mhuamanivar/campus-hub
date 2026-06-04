import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ToggleReactionDto } from './dto/toggle-reaction.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';

interface AuthUser { id: string }

@Controller('events')
export class ReactionsController {
  constructor(private reactionsService: ReactionsService) {}

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id/reactions')
  getReactions(@Param('id') id: string, @CurrentUser() user?: AuthUser) {
    return this.reactionsService.getReactions(id, user?.id);
  }

  @Post(':id/reactions')
  @HttpCode(HttpStatus.OK)
  toggleReaction(
    @Param('id') id: string,
    @Body() dto: ToggleReactionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reactionsService.toggleReaction(id, user.id, dto.type);
  }
}
