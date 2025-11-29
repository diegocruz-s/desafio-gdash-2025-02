import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/domain/user/entity/user';
import { IUserRepository } from 'src/domain/user/repository/UsersRepository';
import { UserMapper } from '../mappers/UserMapper';
import { UserDocument, UserMongo } from '../schemas/user.schema';

@Injectable()
// remember remove Partial<>
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(UserMongo.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(user: User): Promise<void> {
    const persistance = UserMapper.toPersistance(user);
    await this.userModel.create(persistance);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    if (!user) return null;

    return UserMapper.toDomain(user);
  }
}
