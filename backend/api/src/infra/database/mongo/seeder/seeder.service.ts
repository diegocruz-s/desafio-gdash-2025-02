import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { OptionsAccount, User } from 'src/domain/user/entity/user';
import { IUserRepository } from 'src/domain/user/repository/UsersRepository';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private readonly userRepository: IUserRepository) {}
  async onModuleInit() {
    await this.seedInitialUser();
  }

  private async seedInitialUser() {
    const defaultEmail = 'emailPadrao@example.com';
    const existingUser = await this.userRepository.findByEmail(defaultEmail);

    if (!existingUser) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('SenhaPadrao123', saltRounds);

      const initialUser = User.create({
        name: 'Nome padrão',
        email: defaultEmail,
        passwordHash: hashedPassword,
        role: OptionsAccount.USER,
      });

      await this.userRepository.create(initialUser);
      console.log('Usuário padrão inicial criado com sucesso!');
    } else {
      console.log('Usuário padrão já existe. Pulando a criação.');
    }
  }
}
