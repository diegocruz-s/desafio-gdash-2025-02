import { Module } from '@nestjs/common';
import { WeatherSnapshotService } from 'src/domain/weather/service/weatherSnapshot.service';
import { ConvertDataToXlsxModule } from '../convertDataToXlsx/convertData.module';
import { DatabaseModule } from '../database/database.module';
import { WeatherSnapshotController } from './controllers/weatherSnapshot.controller';
import { UserService } from 'src/domain/user/service/user.service';
import { UserController } from './controllers/user.controller';
import { CryptographModule } from '../cryptography/cryptography.module';

@Module({
  imports: [DatabaseModule, ConvertDataToXlsxModule, CryptographModule],
  controllers: [WeatherSnapshotController, UserController],
  providers: [WeatherSnapshotService, UserService],
})
export class HttpModule {}
