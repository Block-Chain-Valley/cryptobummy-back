import { Injectable } from '@nestjs/common';
import { Birth } from '@prisma/client';
import { BirthHistoryInfo } from './interface/birth-info.interface';
import { BirthHistoryDto } from './dto/birth-history.dto';
import { RegisterBirthTxPayload } from './payload/register-birth-tx.payload';
import {ethers} from 'ethers';

@Injectable()
export class BirthService {
    const provider = new ethers.providers.JsonRpcProvider("https://public-node-api.klaytnapi.com/v1/baobab");
  
    async addBirthData(
    payload: RegisterBirthTxPayload,
  ){

  } Promise<BirthHistoryDto> {}
}
