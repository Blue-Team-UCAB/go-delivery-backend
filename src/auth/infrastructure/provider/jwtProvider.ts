import { JwtService } from '@nestjs/jwt';

export const JwtProvider = [
  {
    provide: 'JwtGenerator',
    useFactory: () => {
      const jwtService = new JwtService({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: '24h' },
      });
      return jwtService;
    },
  },
];
