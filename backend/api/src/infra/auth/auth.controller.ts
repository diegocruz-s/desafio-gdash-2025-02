import { Body, Controller, Post } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../http/pipes/zodValidationPipe';
import { AuthService } from './auth.service';

const loginBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

type LoginBodySchema = z.infer<typeof loginBodySchema>;
const bodyValidationPipe = new ZodValidationPipe(loginBodySchema);

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async singIn(@Body(bodyValidationPipe) body: LoginBodySchema) {
    const { email, password } = body;
    const { accessToken } = await this.authService.signIn(email, password);
    return {
      accessToken,
    };
  }
}
