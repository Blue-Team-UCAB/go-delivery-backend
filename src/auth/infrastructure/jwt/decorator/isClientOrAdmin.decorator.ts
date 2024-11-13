import { applyDecorators, SetMetadata } from '@nestjs/common';
import { UseAuth } from './useAuth.decorator';

export function IsClientOrAdmin() {
  return applyDecorators(UseAuth(), SetMetadata('roles', ['CLIENT', 'ADMIN']));
}
