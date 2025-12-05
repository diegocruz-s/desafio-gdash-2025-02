import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WeatherSnapshotInsightsService } from 'src/domain/weather/service/insights.service';
import { JwtAuthGuard } from 'src/infra/auth/auth.guard';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zodValidationPipe';

const periodQueryParamSchema = z
  .string()
  .optional()
  .default('24')
  .transform(Number)
  .pipe(z.number().min(1));

const periodValidationPipe = new ZodValidationPipe(periodQueryParamSchema);
type PeriodQueryParamSchema = z.infer<typeof periodQueryParamSchema>;

@Controller('/weather')
export class WeatherSnapshotInsightsController {
  constructor(
    private weatherSnapshotInsightsService: WeatherSnapshotInsightsService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  @Get('/insights')
  async generateWeatherSnapshotsInsights(
    @Query('period', periodValidationPipe) period: PeriodQueryParamSchema,
  ) {
    const { errors, result } =
      await this.weatherSnapshotInsightsService.execute({
        periodInHours: period,
      });

    if (errors) throw new BadRequestException(errors);

    return {
      weatherSnapshotsInsights: result,
    };
  }
}
