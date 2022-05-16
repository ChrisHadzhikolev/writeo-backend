import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'role';
export const hasRole = (role: string) => SetMetadata(ROLE_KEY, role);
