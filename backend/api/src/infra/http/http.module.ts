import { Module } from '@nestjs/common';
import { WeatherSnapshotService } from 'src/domain/weather/service/weatherSnapshotservice';
import { DatabaseModule } from '../database/database.module';
import { WeatherSnapshotController } from './controllers/weatherSnapshot.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [WeatherSnapshotController],
  providers: [WeatherSnapshotService],
})
export class HttpModule {}
