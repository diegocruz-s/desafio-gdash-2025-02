import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { IConvertDataToXlsx } from 'src/domain/weather/convertToXlsx/ConvertDataToXlsx';
import { WeatherSnapshot } from 'src/domain/weather/entity/weatherSnapshot';
import { PassThrough, Readable } from 'stream';

@Injectable()
export class ExceljsConvertXlxs implements IConvertDataToXlsx {
  convert(inputStream: Readable): Readable {
    const outputStream = new PassThrough();
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: outputStream,
      useStyles: true,
      useSharedStrings: true,
    });
    const worksheet = workbook.addWorksheet('Data');
    worksheet.columns = [
      { header: 'id', key: 'id' },
      { header: 'temperature', key: 'temperature' },
      { header: 'windSpeed', key: 'windSpeed' },
      { header: 'humidity', key: 'humidity' },
      { header: 'city', key: 'city' },
      { header: 'source', key: 'source' },
      { header: 'collectedAt', key: 'collectedAt' },
      { header: 'createdAt', key: 'createdAt' },
    ];

    inputStream.on('data', (chunk: WeatherSnapshot) => {
      const datas = {
        id: chunk.id,
        temperature: chunk.temperature,
        windSpeed: chunk.windSpeed,
        humidity: chunk.humidity,
        city: chunk.city ?? '',
        source: chunk.source ?? '',
        collectedAt: chunk.collectedAt.toISOString(),
        createdAt: chunk.createdAt.toISOString(),
      };
      worksheet.addRow(datas).commit();
    });

    inputStream.on('end', () => {
      (async () => {
        await workbook.commit();
      })().catch((err: Error) => console.log(`${err.message}`));
    });

    return outputStream;
  }
}
