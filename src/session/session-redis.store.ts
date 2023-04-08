import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { SessionStoreInterface } from './session-store.interface';

@Injectable()
export class RedisStore implements SessionStoreInterface {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  /**
   * @inheritDoc
   */
  public get(id: string): Promise<string | null> {
    return this.redis.get(id);
  }

  /**
   * @inheritDoc
   */
  async set(id: string, value: string, lifetime?: number): Promise<boolean> {
    // eslint-disable-next-line max-len
    const args: [string, string, 'EX'?, number?] = lifetime
      ? [id, value, 'EX', lifetime]
      : [id, value];

    return this.redis.set(...args).then(result => result === 'OK');
  }

  /**
   * @inheritDoc
   */
  public update(id: string, value): Promise<boolean> {
    return this.redis.ttl(id).then(ttl => {
      const args: [string, string, 'EX'?, number?] = ttl > 0 ? [id, value, 'EX', ttl] : [id, value];

      return this.redis.set(...args).then(result => result === 'OK');
    });
  }

  /**
   * @inheritDoc
   */
  async destroy(id: string) {
    await this.redis.del(id);
  }
}
