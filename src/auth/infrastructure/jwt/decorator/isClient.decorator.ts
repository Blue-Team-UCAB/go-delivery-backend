import { applyDecorators, SetMetadata } from '@nestjs/common';
import { UseAuth } from './useAuth.decorator';

export function IsClient() {
  return applyDecorators(UseAuth(), SetMetadata('roles', ['CLIENT']));
}
