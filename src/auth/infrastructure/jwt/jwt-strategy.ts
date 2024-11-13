import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../jwt/jwt-payload.interface';
import { IUserRepository } from '../../application/repository/user-repository.interface';
import { User } from '../../application/model/user-model';
import { Inject, NotFoundException } from '@nestjs/common';
import { Optional } from '../../../common/domain/result-handler/optional.handler';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;
    const user: Optional<User> = await this.userRepository.getById(id);
    if (user.getAssigned() === false) {
      throw new NotFoundException('User Not FOUND');
    }
    return user.getValue();
  }
}
