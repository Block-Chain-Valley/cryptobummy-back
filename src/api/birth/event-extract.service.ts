import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { providers } from 'ethers';
@Injectable()
export class EventExtractService {
  constructor() {}
  private async validateTxHash(
    provider: providers.Provider,
    txHash: string,
  ): Promise<providers.TransactionReceipt> {
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt)
      throw new BadRequestException(
        `Transaction not exists. Tx Hash: ${txHash}`,
      );
    return receipt;
  }

  async extractBirthEvent(
    provider: providers.Provider,
    txHash: string,
    address: string,
  ) {
    const receipt = await this.validateTxHash(provider, txHash);
    //TODO
  }
}
