import { Module } from '@nestjs/common';
import { BirthController } from './birth.controller';
import { BirthService } from './birth.service';

@Module({
  imports: [],
  controllers: [BirthController],
  providers: [BirthService],
})
export class BirthModule {}
