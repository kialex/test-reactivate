import { Controller, Get, Headers, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtSessionGuard } from '../session/guards/jwt-session.guard';
import { RequestWithSession } from '../session/interfaces/request-with-session';

@Controller('user-activity')
export class UserActivityController {
  @UseGuards(JwtSessionGuard)
  @Get('my-info')
  myInfo(@Req() req: RequestWithSession<Request>): Record<any, any> {
    return req.session.user;
  }

  @UseGuards(JwtSessionGuard)
  @Get('my-headers')
  myHeaders(@Headers() headers: Record<any, any>): Record<any, any> {
    return headers;
  }
}
