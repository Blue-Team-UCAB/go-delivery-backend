import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './jwt-auth-role.guard';

export function UseAuth() {
  return applyDecorators(UseGuards(AuthGuard('jwt'), RolesGuard));
}
