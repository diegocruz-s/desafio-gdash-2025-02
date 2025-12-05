import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../http/pipes/zodValidationPipe';
import { AuthService } from './auth.service';

const loginBodySchema = z.object({
  email: z.email({
    error: (issue) => issue.input === undefined && 'Email is not provided!',
  }),
  password: z.string({ error: 'Password is not provided!' }),
});

type LoginBodySchema = z.infer<typeof loginBodySchema>;
const bodyValidationPipe = new ZodValidationPipe(loginBodySchema);

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async singIn(@Body(bodyValidationPipe) body: LoginBodySchema) {
    const { email, password } = body;
    const { errors, result } = await this.authService.signIn(email, password);

    if (errors) throw new UnauthorizedException(errors);

    return {
      accessToken: result.accessToken,
    };
  }
}
