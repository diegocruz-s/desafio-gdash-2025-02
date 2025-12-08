import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/domain/user/service/user.service';
import { CurrentUser } from 'src/infra/auth/auth.decorator';
import { JwtAuthGuard } from 'src/infra/auth/auth.guard';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zodValidationPipe';
import { UserPresenter } from '../presenters/user.presenter';

const createUserBodySchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(6),
});

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>;
const bodyCreateValidationPipe = new ZodValidationPipe(createUserBodySchema);

const updateUserBodySchema = z.object({
  name: z.optional(z.string().min(3)),
  email: z.optional(z.email()),
  password: z.optional(z.string().min(6)),
});

type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>;
const bodyUpdateValidationPipe = new ZodValidationPipe(updateUserBodySchema);

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getHello(): string {
    return 'Hello World';
  }

  @Post()
  async create(@Body(bodyCreateValidationPipe) body: CreateUserBodySchema) {
    const { errors, result } = await this.userService.create(body);

    if (errors) throw new BadRequestException(errors);

    return {
      user: UserPresenter.toHTTP(result),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findUser(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserPayload,
  ) {
    if (currentUser.sub !== id)
      throw new UnauthorizedException('You only view a your user!');
    const { errors, result } = await this.userService.findUserById(id);

    if (errors) {
      if (errors[0].includes('not found')) throw new NotFoundException(errors);
      throw new BadRequestException(errors);
    }

    return {
      user: UserPresenter.toHTTP(result),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(
    @CurrentUser() currentUser: UserPayload,
    @Param('id') id: string,
  ) {
    if (currentUser.sub !== id)
      throw new UnauthorizedException('You only delete a your user!');

    const { errors, result } = await this.userService.delete(id);
    if (errors) {
      if (errors[0].includes('not found')) throw new NotFoundException(errors);
      throw new BadRequestException(errors);
    }

    return {
      message: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(
    @CurrentUser() currentUser: UserPayload,
    @Param('id') id: string,
    @Body(bodyUpdateValidationPipe) body: UpdateUserBodySchema,
  ) {
    if (currentUser.sub !== id)
      throw new UnauthorizedException('You only update a your user!');

    const input = {
      userId: currentUser.sub,
      ...body,
    };

    const { errors, result } = await this.userService.update(input);

    if (errors) {
      if (errors[0].includes('not found')) throw new NotFoundException(errors);
      throw new BadRequestException(errors);
    }

    return {
      user: UserPresenter.toHTTP(result),
    };
  }
}
