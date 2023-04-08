import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService {
  constructor(private configService: ConfigService) {}

  /**
   * @return {string}
   */
  get host(): string {
    return this.configService.get('REDIS_HOST', 'localhost');
  }

  /**
   * @return {number}
   */
  get port(): number {
    return parseInt(this.configService.get('REDIS_PORT', '6379'));
  }
}
