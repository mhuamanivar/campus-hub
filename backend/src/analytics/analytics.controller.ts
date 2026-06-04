import { Controller, Get, Query } from '@nestjs/common';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { AnalyticsService } from './analytics.service';
import { Public } from '../common/decorators/public.decorator';

class PopularQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(20)
  limit?: number;
}

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Public()
  @Get('overview')
  getOverview() {
    return this.analyticsService.getOverview();
  }

  @Public()
  @Get('events/popular')
  getPopularEvents(@Query() query: PopularQueryDto) {
    return this.analyticsService.getPopularEvents(query.limit);
  }

  @Public()
  @Get('events/by-category')
  getByCategory() {
    return this.analyticsService.getByCategory();
  }

  @Public()
  @Get('events/distribution')
  getDistribution() {
    return this.analyticsService.getEventDistribution();
  }
}
