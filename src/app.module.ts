import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BirthModule } from './birth/birth.module';
import { ExhaustModule } from './exhaust/exhaust.module';
import { TransferModule } from './transfer/transfer.module';

@Module({
  imports: [BirthModule, ExhaustModule, TransferModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
