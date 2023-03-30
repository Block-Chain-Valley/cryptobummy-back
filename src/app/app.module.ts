import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BirthModule } from '../api/birth/birth.module';
import { ExhaustModule } from '../api/exhaust/exhaust.module';
import { TransferModule } from '../api/transfer/transfer.module';
import { AppService } from './app.service';

@Module({
  imports: [BirthModule, ExhaustModule, TransferModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
