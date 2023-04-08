import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionConfigService {
  constructor(private configService: ConfigService) {}

  /**
   * @return {number}
   */
  get lifetime(): number {
    return parseInt(this.configService.get('SESSION_LIFETIME', '10800'));
  }

  /**
   * @return {number}
   */
  get activityDuration(): number {
    return parseInt(this.configService.get('SESSION_ACTIVITY_DURATION', '3600'));
  }

  /**
   * @return {number}
   */
  get blockingDuration(): number {
    return parseInt(this.configService.get('SESSION_BLOCKING_DURATION', '300'));
  }
}
