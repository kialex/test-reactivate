import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { SessionService } from '../session/session.service';
import { LoginRequestDto } from './dto/login.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  private users = [
    {
      uuid: '838efd0d-b193-4548-92c6-78f89099d1c4',
      email: 'developer@reactivate.com',
      passwd: '$2b$10$VwthF9iTPQ0q3gkjAFTFFuJRAipbiv2LgXFYxDwaNTUxKnZvOCQC6',
    },
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly session: SessionService,
  ) {}

  /**
   * @param data
   */
  public async login(data: LoginRequestDto & { ipAddress: string; userAgent: string }) {
    const user = this.users.find(value => value.email === data.email);
    if (!user) {
      this.logger.warn('User not found.');
      throw new NotFoundException('User not found');
    }

    if (!(await bcrypt.compare(data.password, user.passwd))) {
      this.logger.warn('Invalid password.');
      throw new ForbiddenException('Incorrect login or password');
    }

    const sessionId = await this.session
      .set({
        user: {
          email: user.email,
          uuid: user.uuid,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      })
      .catch(() => {
        this.logger.error('Create session error.');
        throw new InternalServerErrorException();
      });

    return {
      accessToken: this.authService.generateAccessToken({ sub: sessionId }),
    };
  }
}
