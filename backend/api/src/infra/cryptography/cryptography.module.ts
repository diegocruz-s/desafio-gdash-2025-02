import { Module } from '@nestjs/common';
import { HashComparer } from 'src/domain/user/cryptograph/hash-comparer';
import { HashGenerator } from 'src/domain/user/cryptograph/hash-generator';
import { BcrpytHasher } from './bcryptHasher';

@Module({
  providers: [
    {
      provide: HashComparer,
      useClass: BcrpytHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcrpytHasher,
    },
  ],
  exports: [HashComparer, HashGenerator],
})
export class CryptographModule {}
