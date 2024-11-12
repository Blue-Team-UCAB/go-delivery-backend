import { JwtService } from '@nestjs/jwt';
import { IJwtGenerator } from '../../../common/application/jwt-generator/jwt-generator.interface';

export class JwtGenerator implements IJwtGenerator<string> {
  private readonly jwtService: JwtService;

  constructor(jwtService: JwtService) {
    this.jwtService = jwtService;
  }

  generateJwt(param: string): string {
    return this.jwtService.sign(param);
  }
}
