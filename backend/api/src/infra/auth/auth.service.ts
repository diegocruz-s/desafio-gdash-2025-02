import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IServiceResponse } from 'src/domain/interfaces/protocols';
import { HashComparer } from 'src/domain/user/cryptograph/hash-comparer';
import { IUserRepository } from 'src/domain/user/repository/UsersRepository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashCompare: HashComparer,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<IServiceResponse<{ accessToken: string }>> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return {
        errors: ['Authentication Failed!'],
      };
    }

    const isMatchPassword = await this.hashCompare.compare(
      password,
      user.passwordHash,
    );

    if (!isMatchPassword) {
      return {
        errors: ['Authentication Failed!'],
      };
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      result: {
        accessToken: token,
      },
    };
  }
}
