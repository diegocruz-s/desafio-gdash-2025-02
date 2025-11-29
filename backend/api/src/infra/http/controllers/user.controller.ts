import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { UserService } from 'src/domain/user/service/user.service';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zodValidationPipe';

const createUserBodySchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(6),
});

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>;
const bodyValidationPipe = new ZodValidationPipe(createUserBodySchema);

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getHello(): string {
    return 'Hello World';
  }

  @Post()
  async create(@Body(bodyValidationPipe) body: CreateUserBodySchema) {
    const { errors, result } = await this.userService.create(body);

    if (errors) throw new BadRequestException();

    return {
      user: result,
    };
  }
}
