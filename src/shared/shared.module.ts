import { Global, Module } from '@nestjs/common';

import { WordGenerator } from './util/word-generator.util';

@Global()
@Module({
  providers: [WordGenerator],
  exports: [WordGenerator],
})
export class SharedModule {}
