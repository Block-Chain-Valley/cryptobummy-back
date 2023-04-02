import { BadRequestException, Injectable } from '@nestjs/common';
import { Bummy } from '@prisma/client';
import { BirthHistoryInfo } from './interface/birth-info.interface';
import { BirthHistoryDto, BirthHistoryListDto } from './dto/birth-history.dto';
import { RegisterBirthTxPayload } from './payload/register-birth-tx.payload';

import { PrismaService } from 'src/services/prisma.service';

import { ethers } from 'ethers';
import { BummyCore } from '../../typechain';
import { BigNumber } from 'ethers';
import { Contract } from 'ethers';

import abi from '../../abi/BummyCore.json';

@Injectable()
export class BirthService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly INVITE_SIG =
    '0x14cb614758d3c982e9d2ae0ad129c2c2bdb4c5ba841155dced7bed1a27834de7';
  //invite signature => keccak256("Invite(address,uint256,uint256,uint256,uint256)")

  provider = new ethers.providers.JsonRpcProvider(
    // 'https://public-node-api.klaytnapi.com/v1/baobab',
    'http://127.0.0.1:8545/',
  );

  cbAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  //요거 나중에 대소문자 비교 안하게 바꿔야함

  private async validateTxHash(
    provider: ethers.providers.JsonRpcProvider,
    txHash: string,
  ): Promise<ethers.providers.TransactionReceipt> {
    //이걸로 transaction block 전체를 받아옴... 원하는 정보는 receipt.log에 있음!
    console.log(txHash);
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt)
      throw new BadRequestException(
        `Transaction not exists. Tx Hash: ${txHash}`,
      );
    return receipt;
  }

  async addBirthEvent(txHash: string) {
    const cryptoBummy = new ethers.Contract(this.cbAddress, abi, this.provider);

    const receipt = await this.validateTxHash(this.provider, txHash);
    console.log(receipt.logs);
    const inviteEvent = receipt.logs.filter(
      (log) =>
        log.topics[0] === this.INVITE_SIG && log.address === this.cbAddress,
    );
    console.log(inviteEvent);

    const ie = inviteEvent[0];
    console.log(ie);
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

    const birthEvent = await this.prisma.bummy.create({
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

  //get one birth event
  async getBirthEvent(BummyId: string): Promise<BirthHistoryDto> {
    const birth = await this.prisma.bummy.findUnique({
      select: {
        id: true,
        blockNumber: true,
        createdAt: true,
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
    return BirthHistoryDto.of(birth);
  }

  async getBirthEvents(owner: string): Promise<BirthHistoryListDto> {
    const history = await this.prisma.bummy.findMany({
      select: {
        id: true,
        blockNumber: true,
        createdAt: true,
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
    return BirthHistoryListDto.of(history);
  }
}
