import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import { AppService } from './app.service';
import {AuthGuard} from "./guards/auth.guard";

@Controller({

})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard)
  @Get('messages')
  getMessages(@Req() req) {
    console.log('useId: ', req.userId)
    return 'messages'
  }
}
