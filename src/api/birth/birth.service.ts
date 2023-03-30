import { Injectable } from '@nestjs/common';
import { Birth } from '@prisma/client';
import { BirthHistoryInfo } from './interface/birth-info.interface';
import { BirthHistoryDto } from './dto/birth-history.dto';

@Injectable()
export class BirthService {
  async addBirthData(): Promise<BirthHistoryDto> {}
}
