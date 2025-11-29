import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedException();

    const isMatchPassword = await this.hashCompare.compare(
      password,
      user.passwordHash,
    );

    if (!isMatchPassword) throw new UnauthorizedException();

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
    };
  }
}
