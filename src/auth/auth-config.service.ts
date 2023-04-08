import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfigService {
  constructor(private configService: ConfigService) {}

  /**
   * @return {string}
   */
  get JWTSecret(): string {
    return this.configService.getOrThrow<string>('AUTH_JWT_SECRET');
  }
}
