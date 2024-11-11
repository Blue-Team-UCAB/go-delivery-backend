import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
@Controller()
export class AppController {
  @Get()
  getHome(@Res() res: Response) {
    res.send(`
      <html>
        <head><title>Inicio</title></head>
        <body>
          <h1>Bienvenido a la página de inicio</h1>
          <p>Esta es una introducción.</p>
        </body>
      </html>
    `);
  }
}
