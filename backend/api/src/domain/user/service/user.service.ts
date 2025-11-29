import { Injectable } from '@nestjs/common';
import { IServiceResponse } from '../../interfaces/protocols';
import { HashGenerator } from '../cryptograph/hash-generator';
import { OptionsAccount, User } from '../entity/user';
import { IUserRepository } from '../repository/UsersRepository';

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: IUserRepository,
    private readonly hashPassword: HashGenerator,
  ) {}
  async create(input: CreateUserInput): Promise<IServiceResponse<User>> {
    const { email, name, password } = input;
    const findUser = await this.usersRepository.findByEmail(email);

    if (findUser) {
      return {
        errors: ['Email is already exists!'],
      };
    }

    const passwordHash = await this.hashPassword.hash(password);
    const role = OptionsAccount.USER;

    const user = User.create({
      email,
      name,
      passwordHash,
      role,
    });

    await this.usersRepository.create(user);

    return {
      result: user,
    };
  }

  // async findUser(id: string): Promise<IServiceResponse<User>> {
  //   const user = await this.usersRepository.findById(id);
  //   if (!user) {
  //     return {
  //       errors: ['User not found!'],
  //     };
  //   }

  //   return {
  //     result: user,
  //   };
  // }

  // async delete(id: string): Promise<IServiceResponse<string>> {
  //   const user = await this.usersRepository.findById(id);
  //   if (!user) {
  //     return {
  //       errors: ['User not found!'],
  //     };
  //   }

  //   user.deactivate();
  //   await this.usersRepository.delete(user);

  //   return {
  //     result: 'User deleted',
  //   };
  // }
}
