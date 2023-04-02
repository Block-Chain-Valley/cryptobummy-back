import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { BirthController } from './birth.controller';
import { BirthService } from './birth.service';

@Module({
  imports: [],
  controllers: [BirthController],
  providers: [BirthService, PrismaService],
})
export class BirthModule {}
