import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Never throw — unauthenticated requests pass through with user = null
  handleRequest<TUser>(_err: unknown, user: TUser): TUser | null {
    return user ?? null;
  }
}
