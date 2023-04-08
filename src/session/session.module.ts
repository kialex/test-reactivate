import { Global, Module } from '@nestjs/common';
import { RedisStore } from './session-redis.store';
import { SESSION_STORE_SERVICE } from './session-store.interface';
import { SessionService } from './session.service';
import { SessionConfigService } from './session-config.service';
import { JwtSessionGuard } from './guards/jwt-session.guard';

@Global()
@Module({
  providers: [
    SessionService,
    SessionConfigService,
    JwtSessionGuard,
    {
      useClass: RedisStore,
      provide: SESSION_STORE_SERVICE,
    },
  ],
  exports: [SessionService, JwtSessionGuard, SessionConfigService, SESSION_STORE_SERVICE],
})
export class SessionModule {}
