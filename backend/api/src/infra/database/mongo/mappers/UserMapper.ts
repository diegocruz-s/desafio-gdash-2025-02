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
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw._id,
    );
  }
  static toPersistance(entity: User): Partial<UserMongo> {
    return {
      _id: entity.id,
      createdAt: entity.createdAt,
      email: entity.email,
      name: entity.name,
      passwordHash: entity.passwordHash,
      role: entity.role,
      updatedAt: entity.updatedAt,
    };
  }
}
