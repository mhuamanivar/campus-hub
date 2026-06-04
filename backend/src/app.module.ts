import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { AttendanceModule } from './attendance/attendance.module';
import { CommentsModule } from './comments/comments.module';
import { ReactionsModule } from './reactions/reactions.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ServicesModule } from './services-module/services.module';
import { ProductsModule } from './products/products.module';
import { LoansModule } from './loans/loans.module';
import { NotificationsModule } from './notifications/notifications.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    EventsModule,
    AttendanceModule,
    CommentsModule,
    ReactionsModule,
    AnalyticsModule,
    ServicesModule,
    ProductsModule,
    LoansModule,
    NotificationsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
