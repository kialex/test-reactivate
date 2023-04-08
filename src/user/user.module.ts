import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtMiddleware } from '../auth/middlewares/jwt.middleware';
import { DetectActivityMiddleware } from '../session/middlewares/detect-activity.middleware';
import { AuthModule } from '../auth/auth.module';
import { SessionModule } from '../session/session.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserActivityController } from './user-activity.controller';

@Module({
  imports: [AuthModule, SessionModule],
  controllers: [UserController, UserActivityController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware, DetectActivityMiddleware).forRoutes(UserActivityController);
  }
}
