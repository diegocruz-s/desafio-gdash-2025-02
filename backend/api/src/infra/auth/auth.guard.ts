import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override handleRequest<TUser = any>(err: any, user: TUser): TUser {
    if (err || !user) {
      throw new UnauthorizedException({
        message: 'Invalid token',
        error: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
    return user;
  }
}
