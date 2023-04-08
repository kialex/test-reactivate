import { Injectable, Logger } from '@nestjs/common';
import { JwtPayload, sign } from 'jsonwebtoken';
import { AuthConfigService } from './auth-config.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly config: AuthConfigService) {}

  /**
   * @param data
   */
  public generateAccessToken(data: JwtPayload) {
    return sign(data, this.config.JWTSecret);
  }
}
