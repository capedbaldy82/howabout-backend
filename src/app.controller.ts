import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get('/')
  getProduct(): string {
    return 'test: how about doing this';
  }
}
