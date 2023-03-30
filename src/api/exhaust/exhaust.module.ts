import { Module } from '@nestjs/common';
import { ExhaustController } from './exhaust.controller';
import { ExhaustService } from './exhaust.service';

@Module({
  controllers: [ExhaustController],
  providers: [ExhaustService]
})
export class ExhaustModule {}
