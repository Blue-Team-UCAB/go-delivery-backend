import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
@Controller()
export class AppController {
  @Get()
  getHome(@Res() res: Response) {
    res.redirect('https://back.godely.net/api/documentation');
  }
}
