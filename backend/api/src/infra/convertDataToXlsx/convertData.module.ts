import { Module } from '@nestjs/common';
import { IConvertDataToXlsx } from '../../domain/weather/convertToXlsx/ConvertDataToXlsx';
import { ExceljsConvertXlxs } from './ExcelConvert';

@Module({
  providers: [
    {
      provide: IConvertDataToXlsx,
      useClass: ExceljsConvertXlxs,
    },
  ],
  exports: [IConvertDataToXlsx],
})
export class ConvertDataToXlsxModule {}
