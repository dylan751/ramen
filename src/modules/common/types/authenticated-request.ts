import { Request } from 'express';
import { User } from 'src/db/entities/user.entity';

export interface AuthenticatedRequest extends Request {
  user: User;
}

export interface MaybeAuthenticatedRequest extends Request {
  user?: User;
}
