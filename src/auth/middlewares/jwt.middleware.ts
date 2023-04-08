import * as util from 'util';
import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { JwtPayload, VerifyOptions, verify } from 'jsonwebtoken';
import { SessionService } from '../../session/session.service';
import { RequestWithSession } from '../../session/interfaces/request-with-session';
import { AuthConfigService } from '../auth-config.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  private readonly logger = new Logger(JwtMiddleware.name);

  constructor(
    private readonly config: AuthConfigService,
    private readonly session: SessionService,
  ) {}

  async use(req: RequestWithSession<Request>, res: Response, next: NextFunction) {
    this.logger.log('JWT Middleware called');
    const nextCb = (err?: any) => {
      return next(err ? new UnauthorizedException(err.message) : null);
    };

    const jwtToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!jwtToken) {
      this.logger.warn('JWT Token does not exist. Next...');

      return nextCb();
    }
    this.logger.log('JWT Token received!');

    util
      .promisify<string, string, VerifyOptions, JwtPayload>(verify)(
        jwtToken,
        this.config.JWTSecret,
        {},
      )
      .then(payload => {
        this.logger.log('JWT token is valid! Payload successfully unpacked');

        return payload.sub;
      })
      .then(sessionId => this.session.get(sessionId))
      .then(sessionData => {
        req.session = sessionData;
        if (!req.session) {
          this.logger.warn('Session is Expired! Next...');

          return;
        }
        this.logger.log('Session data has been received! Next...');
      })
      .then(nextCb, nextCb);
  }
}
