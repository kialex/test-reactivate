import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SessionService } from '../session.service';
import { RequestWithSession } from '../interfaces/request-with-session';
import { SessionDataInterface } from '../interfaces/session-data.interface';
import { SessionConfigService } from '../session-config.service';

@Injectable()
export class DetectActivityMiddleware implements NestMiddleware {
  private readonly logger = new Logger(DetectActivityMiddleware.name);

  constructor(
    private readonly session: SessionService,
    private readonly config: SessionConfigService,
  ) {}

  async use(req: RequestWithSession<Request>, res: Response, next: NextFunction) {
    this.logger.log('Detect Activity Middleware called');
    if (!req.session) {
      this.logger.warn('Session is Expired. Skip Detect Activity Middleware. Next...');
      next();

      return;
    }

    return this.checkActivity(req.session).then(() => next());
  }

  protected async checkActivity(sessionData: SessionDataInterface | null) {
    if (!sessionData) {
      this.logger.warn('Session expired!');
      throw new UnauthorizedException('SESSION_EXPIRED');
    }

    const currentTime = Math.round(Date.now() / 1000);

    if (sessionData.lastUnlockedTime !== null) {
      /*
       * Nothing actions if `lastUnlockedTime` is valid.
       */
      if (sessionData.lastUnlockedTime + this.config.activityDuration > currentTime) {
        const blockedTime = Math.round(
          sessionData.lastUnlockedTime + this.config.activityDuration - currentTime,
        );
        this.logger.log(`Session is active! Remaining ${blockedTime} seconds...`);

        return;
      }

      /*
       * Else:
       * Set `blockedTime`.
       */
      // eslint-disable-next-line max-len
      await this.session.regenerate(sessionData.id, {
        lastUnlockedTime: null,
        blockedTime: currentTime,
      });
      this.logger.warn(`Session has been blocked for ${this.config.blockingDuration} seconds...`);
      throw new UnauthorizedException(
        `Session is blocked during ${this.config.blockingDuration} seconds`,
      );
    }

    if (sessionData.blockedTime !== null) {
      /*
       * Nothing actions if blocking still valid
       */
      if (sessionData.blockedTime + this.config.blockingDuration > currentTime) {
        const unblockedTime = Math.round(
          sessionData.blockedTime + this.config.blockingDuration - currentTime,
        );
        this.logger.warn(`Session is blocked! Unlocked after ${unblockedTime} seconds...`);
        throw new UnauthorizedException(`Session will be unlocked after ${unblockedTime} seconds.`);
      }

      /*
       * Else:
       * Unlock session and continue
       */
      // eslint-disable-next-line max-len
      await this.session.regenerate(sessionData.id, {
        lastUnlockedTime: currentTime,
        blockedTime: null,
      });

      this.logger.log(`Session unblocked! Continue activity...`);

      return;
    }
  }
}
