import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get() // Esto define la ruta de inicio ("/")
  getHome(): string {
    return 'Bienvenido a la página de inicio';
  }
}
