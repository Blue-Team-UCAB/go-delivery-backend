import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../jwt/jwt-strategy';

export const JwtProvider = [
  {
    provide: 'JwtGenerator',
    useFactory: () => {
      return new JwtService({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: '24h' },
      });
    },
  },
  {
    provide: 'PassportModule',
    useFactory: () => {
      return PassportModule.register({ defaultStrategy: 'jwt' });
    },
  },
  {
    provide: 'JwtStrategy',
    useClass: JwtStrategy,
  },
];
