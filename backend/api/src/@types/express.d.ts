import { UserPayload } from 'src/infra/auth/jwt.strategy';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
