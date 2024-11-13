import { applyDecorators, SetMetadata } from '@nestjs/common';
import { UseAuth } from './useAuth.decorator';

export function IsAdmin() {
  return applyDecorators(UseAuth(), SetMetadata('roles', ['ADMIN']));
}
