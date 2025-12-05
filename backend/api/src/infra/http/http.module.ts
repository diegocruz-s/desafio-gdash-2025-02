import { Module } from '@nestjs/common';
import { UserService } from 'src/domain/user/service/user.service';
import { WeatherSnapshotInsightsService } from 'src/domain/weather/service/insights.service';
import { WeatherSnapshotService } from 'src/domain/weather/service/weatherSnapshot.service';
import { ConvertDataToXlsxModule } from '../convertDataToXlsx/convertData.module';
import { CryptographModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { WeatherSnapshotInsightsController } from './controllers/insights.controller';
import { UserController } from './controllers/user.controller';
import { WeatherSnapshotController } from './controllers/weatherSnapshot.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    DatabaseModule,
    ConvertDataToXlsxModule,
    CryptographModule,
    CacheModule.register({
      ttl: 1000 * 30,
    }),
  ],
  controllers: [
    WeatherSnapshotController,
    UserController,
    WeatherSnapshotInsightsController,
  ],
  providers: [
    WeatherSnapshotService,
    UserService,
    WeatherSnapshotInsightsService,
  ],
})
export class HttpModule {}
