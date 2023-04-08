import { Global, Module } from '@nestjs/common';
import { RedisModule as BaseRedisModule } from '@liaoliaots/nestjs-redis';
import { RedisConfigService } from './redis-config.service';

@Global()
@Module({
  imports: [
    BaseRedisModule.forRootAsync({
      useFactory: (config: RedisConfigService) => {
        return {
          config: {
            host: config.host,
            port: config.port,
          },
        };
      },
      inject: [RedisConfigService],
    }),
  ],
  providers: [RedisConfigService],
  exports: [RedisConfigService],
})
export class RedisModule {}
