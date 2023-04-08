import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthConfigService } from './auth-config.service';

@Module({
  providers: [AuthService, AuthConfigService],
  exports: [AuthConfigService, AuthService],
})
export class AuthModule {}
