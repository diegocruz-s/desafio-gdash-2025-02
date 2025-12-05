import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodError, ZodType } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}
  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      const messageErrors: string[] = [];

      if (error instanceof ZodError) {
        fromZodError(error).details.map((err) => {
          messageErrors.push(err.message);
        });
        throw new BadRequestException({
          message: messageErrors,
          statusCode: 400,
          error: 'Validation failed',
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
