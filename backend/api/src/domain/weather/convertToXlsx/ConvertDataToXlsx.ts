import { Readable } from 'stream';

export abstract class IConvertDataToXlsx {
  abstract convert(inputStream: Readable): Readable;
}
