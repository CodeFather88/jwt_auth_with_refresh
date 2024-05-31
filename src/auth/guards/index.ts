import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';

export const GUARDS = [AuthGuard, RolesGuard];