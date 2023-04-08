import { Body, Controller, Post, Ip, Headers } from '@nestjs/common';
import { LoginRequestDto } from './dto/login.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('login')
  login(
    @Body() data: LoginRequestDto,
    @Ip() ipAddress: string,
    @Headers('User-Agent') userAgent: string,
  ): Promise<{ accessToken: string }> {
    return this.service.login({ ...data, userAgent, ipAddress });
  }
}
