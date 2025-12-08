import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from './http/http.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      ttl: 1000 * 30,
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    HttpModule,
  ],
})
export class AppModule {}
