import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { providers } from 'ethers';
@Injectable()
export class EventExtractService {
  constructor() {}
  //TODO : BIRTH_SIGNATURE 값 수정해줘야함
  private readonly BIRTH_SIGNATURE =
    '0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f';
  private async validateTxHash(
    provider: providers.Provider,
    txHash: string,
  ): Promise<providers.TransactionReceipt> {
    //이걸로 transaction block 전체를 받아옴... 원하는 정보는 receipt.log에 있음!
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
    //provider로부터 txHash를 통해서 필요한 block를 받아옴
    const receipt = await this.validateTxHash(provider, txHash);
    //이거 왜 필요함?? receipt를 받아오는 시간?
    const createdAt = await provider
      .getBlock(receipt.blockNumber)
      .then((block) => new Date(block.timestamp * 1000));
    //받아온 block에서 필요한 정보만 추출 (address, BIRTH_SIGNATURE로 확인)
    const birthEventLogs = receipt.logs.filter(
      (log) =>
        log.address === address && log.topics[0] === this.BIRTH_SIGNATURE,
    );
    //추출한 정보에서 다시 한번 filtering이 필요함
  }
}
