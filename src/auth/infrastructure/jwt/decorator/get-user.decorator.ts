import { applyDecorators, createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { UseAuth } from './useAuth.decorator';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;

  if (!user) throw new InternalServerErrorException('User not found');

  return user;
});
