import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database/database.module';
import { HashComparer } from 'src/domain/user/cryptograph/hash-comparer';
import { BcrpytHasher } from '../cryptography/bcryptHasher';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  providers: [
    AuthService,
    {
      provide: HashComparer,
      useClass: BcrpytHasher,
    },
    JwtStrategy,
  ],
  exports: [JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
