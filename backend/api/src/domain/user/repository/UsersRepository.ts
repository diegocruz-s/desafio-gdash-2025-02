import { User } from '../entity/user';

export abstract class IUserRepository {
  abstract create(user: User): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
  // abstract findById(id: string): Promise<User | null>;
  // abstract save(user: User): Promise<void>;
  // abstract delete(user: User): Promise<void>;
}
