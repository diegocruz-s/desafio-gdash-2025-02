import { User } from 'src/domain/user/entity/user';
import { UserDocument, UserMongo } from '../schemas/user.schema';

export class UserMapper {
  static toDomain(raw: UserDocument): User {
    return User.create(
      {
        email: raw.email,
        name: raw.name,
        passwordHash: raw.passwordHash,
        role: raw.role,
        isActive: raw.isActive,
        createdAt: raw.createdAt,
      },
      raw._id.toString(),
    );
  }
  static toPersistance(entity: User): Partial<UserMongo> {
    return {
      createdAt: entity.createdAt,
      email: entity.email,
      isActive: entity.isActive,
      name: entity.name,
      passwordHash: entity.passwordHash,
      role: entity.role,
    };
  }
}
