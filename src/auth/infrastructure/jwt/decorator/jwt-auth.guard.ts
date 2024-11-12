import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Result } from 'src/common/Domain/result-handler/Result';
import { User } from '../../../application/model/user-model';
import { DataSource } from 'typeorm';
import { JwtPayload } from '../decorator/jwt-payload.interface';
import { UserRepository } from '../../../infrastructure/repository/user.repository';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private userRepository: UserRepository;

  constructor(
    private jwtService: JwtService,
    @Inject('DataSource') dataSource: DataSource,
  ) {
    this.userRepository = new UserRepository(dataSource);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers['authorization']) throw new UnauthorizedException();
    const [type, token] = request.headers['authorization'].split(' ') ?? [];
    if (type != 'Bearer' || !token) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      const userData = await this.validate(payload);
      request['user'] = userData; //verificar esto
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private async validate(payload: JwtPayload) {
    const user: Result<User> = await this.userRepository.getById(payload.id);
    if (!user.isSuccess()) throw new Error('Error buscando al usuario a traves del token');
    return user.Value;
  }
}
