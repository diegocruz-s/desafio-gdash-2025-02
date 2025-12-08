import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { WeatherSnapshotService } from 'src/domain/weather/service/weatherSnapshot.service';
import { JwtAuthGuard } from 'src/infra/auth/auth.guard';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zodValidationPipe';
import { WeatherSnapshotPresenter } from '../presenters/weatherSnapshot.presenter';

const createWeatherSnapshotBodySchema = z.object({
  temperature: z.coerce.number(),
  windSpeed: z.coerce.number().min(0),
  humidity: z.coerce.number().min(0).max(100),
  collectedAt: z.coerce.date(),
  city: z.optional(z.string()),
  source: z.optional(z.string()),
});

type CreateWeatherSnapshotBodySchema = z.infer<
  typeof createWeatherSnapshotBodySchema
>;
const bodyValidationPipe = new ZodValidationPipe(
  createWeatherSnapshotBodySchema,
);

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/weather')
export class WeatherSnapshotController {
  constructor(private weatherSnapshotService: WeatherSnapshotService) {}

  @Get()
  getHello(): string {
    return 'Hello World';
  }

  @Post()
  async create(
    @Body(bodyValidationPipe) body: CreateWeatherSnapshotBodySchema,
  ) {
    const parsedBody = {
      ...body,
      collectedAt: new Date(body.collectedAt),
    };

    const { errors, result } =
      await this.weatherSnapshotService.create(parsedBody);

    if (errors) throw new BadRequestException(errors);

    return {
      weatherSnapshot: WeatherSnapshotPresenter.toHTTP(result),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logs')
  async fetchWeatherSnapshots(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const { errors, result } =
      await this.weatherSnapshotService.getAllSnapshots({ page });

    if (errors) throw new BadRequestException(errors);

    return {
      weatherSnapshots: result.map((wtSp) =>
        WeatherSnapshotPresenter.toHTTP(wtSp),
      ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/latest')
  async getLatestSnapshot() {
    const { errors, result } =
      await this.weatherSnapshotService.getLatestSnapshot();

    if (errors) throw new BadRequestException(errors);
    const latestSnapshot = {
      ...WeatherSnapshotPresenter.toHTTP(result.weatherSnapshot),
      conditional: result.conditional,
    };

    return {
      weatherSnapshot: latestSnapshot,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/export.csv')
  generateCSVDatas(@Res() res: Response) {
    const result = this.weatherSnapshotService.exportAsCSVStream();

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="weather.csv"',
    });
    result
      .pipe(res)
      .on('finish', () => {
        console.log('Download concluído');
      })
      .on('error', (err) => {
        console.error('Erro ao enviar o arquivo:', err);
      });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/export.xlsx')
  generateXLSXDatas(@Res() res: Response) {
    const result = this.weatherSnapshotService.exportAsXlsxStream();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="weather.xlsx"');

    result
      .pipe(res)
      .on('finish', () => {
        console.log('Download concluído');
      })
      .on('error', (err) => {
        console.error('Erro ao enviar o arquivo:', err);
      });
  }
}
