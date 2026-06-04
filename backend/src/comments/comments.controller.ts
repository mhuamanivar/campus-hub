import {
  Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

interface AuthUser { id: string }

@Controller()
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Get('events/:id/comments')
  findAll(@Param('id') id: string) {
    return this.commentsService.findByEvent(id);
  }

  @Post('events/:id/comments')
  create(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentsService.create(id, user.id, dto);
  }

  @Delete('comments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.commentsService.remove(id, user.id);
  }
}
