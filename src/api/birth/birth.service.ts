import { BadRequestException, Injectable } from '@nestjs/common';
import { Birth } from '@prisma/client';
import { BirthHistoryInfo } from './interface/birth-info.interface';
import { BirthHistoryDto } from './dto/birth-history.dto';
import { RegisterBirthTxPayload } from './payload/register-birth-tx.payload';
import { EventExtractService } from './event-extract.service';
import { PrismaService } from 'src/services/prisma.service';

import { ethers } from 'hardhat';
import { BummyCore } from '../typechain-types';
import { BigNumber } from 'ethers';
import { Contract } from 'ethers';

@Injectable()
export class BirthService {
  constructor(
    private readonly eventExtractService: EventExtractService,
    private readonly prisma: PrismaService,
  ) {}

  private readonly INVITE_SIG =
    '0x14cb614758d3c982e9d2ae0ad129c2c2bdb4c5ba841155dced7bed1a27834de7';
  //invite signature => keccak256("Invite(address,uint256,uint256,uint256,uint256)")

  provider = new ethers.providers.JsonRpcProvider(
    'https://public-node-api.klaytnapi.com/v1/baobab',
  );

  private async validateTxHash(
    provider: ethers.providers.JsonRpcProvider,
    txHash: string,
  ): Promise<ethers.providers.TransactionReceipt> {
    //이걸로 transaction block 전체를 받아옴... 원하는 정보는 receipt.log에 있음!
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt)
      throw new BadRequestException(
        `Transaction not exists. Tx Hash: ${txHash}`,
      );
    return receipt;
  }

  async addBirthEvent(txHash: string) {
    const receipt = await this.validateTxHash(this.provider, txHash);

    const inviteEvent = receipt.logs.filter(
      (log) => log.topics[0] === this.INVITE_SIG,
    );

    const ie = inviteEvent[0];
    let [, owner] = ie.topics;
    owner = owner.slice(-40, 0);

    const BummyId = BigNumber.from('0x' + ie.data.slice(2, 2 + 64)).toString();
    const momId = BigNumber.from(
      '0x' + ie.data.slice(2 + 64, 2 + 64 + 64),
    ).toString();
    const dadId = BigNumber.from(
      '0x' + ie.data.slice(2 + 64 + 64, 2 + 64 + 64 + 64),
    ).toString();
    const genes = BigNumber.from(
      '0x' + ie.data.slice(2 + 64 + 64 + 64, 2 + 64 + 64 + 64 + 64),
    ).toString();

    const block = await this.provider.getBlock(receipt.blockNumber);
    const createdAt = new Date(block.timestamp * 1000);

    const birthEvent = await this.prisma.birth.create({
        data: {
            BummyId: BummyId,
            momId: momId,
            dadId: dadId,
            genes: genes,
            createdAt: createdAt,
            owner: owner,
            blockNumber: receipt.blockNumber,
        },
    });

    }

    // if (birthEvents.length === 0) {
    //   throw new BadRequestException('No birth events in this hash.');
    // }
  }

  //get one birth event
  async getBirthEvent(BummyId: number): Promise<Birth | null> {
    return this.prisma.birth.findUnique({
      select: {
        id: true,
        owner: true,
        BummyId: true,
        momId: true,
        dadId: true,
        genes: true,
      },
      where: {
        BummyId: BummyId,
      },
    });
  }

  async getBirthEvents(owner: string): Promise<BirthHistoryDto[]> {
    return this.prisma.birth.findMany({
      select: {
        id: true,
        owner: true,
        BummyId: true,
        momId: true,
        dadId: true,
        genes: true,
      },
      where: {
        owner: owner,
      },
    });
  }
}
