import { Controller, Get } from '@nestjs/common';

@Controller()
export class TestController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'Hello World';
  }
}
