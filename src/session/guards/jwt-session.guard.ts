import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { RequestWithSession } from '../interfaces/request-with-session';

@Injectable()
export class JwtSessionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithSession<Request>>();

    if (!req.session || !req.session.user) {
      throw new UnauthorizedException("User's session is missing or malformed");
    }

    return true;
  }
}
