import { Module } from '@nestjs/common';
import { TestController } from './controllers/testController.controller';

@Module({
  imports: [],
  controllers: [TestController],
})
export class HttpModule {}
