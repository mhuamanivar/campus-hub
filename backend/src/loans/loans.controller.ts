import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto, CreateResourceDto, UpdateLoanDto } from './dto/loan.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

interface AuthUser { id: string }

@Controller()
export class LoansController {
  constructor(private loansService: LoansService) {}

  @Public()
  @Get('resources')
  getResources() {
    return this.loansService.getResources();
  }

  @Post('resources')
  createResource(@Body() dto: CreateResourceDto) {
    return this.loansService.createResource(dto);
  }

  @Get('loans/my')
  getMyLoans(@CurrentUser() user: AuthUser) {
    return this.loansService.getMyLoans(user.id);
  }

  @Get('loans')
  getAllLoans() {
    return this.loansService.getAllLoans();
  }

  @Post('loans')
  requestLoan(@Body() dto: CreateLoanDto, @CurrentUser() user: AuthUser) {
    return this.loansService.requestLoan(dto, user.id);
  }

  @Patch('loans/:id')
  updateLoan(@Param('id') id: string, @Body() dto: UpdateLoanDto, @CurrentUser() user: AuthUser) {
    return this.loansService.updateLoan(id, dto, user.id);
  }
}
