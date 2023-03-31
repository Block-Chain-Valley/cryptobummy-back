import { BadRequestException, Injectable } from '@nestjs/common';
import { Birth } from '@prisma/client';
import { BirthHistoryInfo } from './interface/birth-info.interface';
import { BirthHistoryDto } from './dto/birth-history.dto';
import { RegisterBirthTxPayload } from './payload/register-birth-tx.payload';
import { ethers } from 'ethers';
import { EventExtractService } from './event-extract.service';

@Injectable()
export class BirthService {
  constructor(private readonly eventExtractService: EventExtractService) {}
  provider = new ethers.providers.JsonRpcProvider(
    'https://public-node-api.klaytnapi.com/v1/baobab',
  );

  async addBirthData(payload: RegisterBirthTxPayload) {
    const birthEvents = this.eventExtractService.extractBirthEvent(
      this.provider,
      payload.txHash,
      payload.address,
    );
    if (birthEvents.length === 0) {
      throw new BadRequestException('No birth events in this hash.');
    }
  }
}
