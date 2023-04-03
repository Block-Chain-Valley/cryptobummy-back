import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { ethers } from 'ethers';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class TransferService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly TRANSFER_SIG =
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
  private readonly provider = new ethers.providers.JsonRpcProvider(
    'https://public-node-api.klaytnapi.com/v1/baobab',
  );
  cbAddress = '0x82356e2dEa4F5b5CBF3d8A2511a7F4BF9631602d';

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

  async addTransfer(txHash: string) {
    const receipt = await this.validateTxHash(this.provider, txHash);
    const inviteEvent = receipt.logs.filter(
      (log) =>
        log.topics[0] === this.TRANSFER_SIG && log.address === this.cbAddress,
    );

    const ie = inviteEvent[0];
    let [, from, to] = ie.topics;
    //TODO
  }
}
