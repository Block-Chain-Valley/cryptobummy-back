import { IsString, IsNotEmpty, IsInt, IsDate } from 'class-validator';
import { InternalServerErrorException } from '@nestjs/common';
import { Transfer } from '@prisma/client';

export class TransferHistoryDto {
  @IsString()
  @IsNotEmpty()
  txHash: string;
}

export class TransferEventDto {
  @IsInt()
  blockNumber: number;
  @IsDate()
  createdAt: Date;
  @IsString()
  from: string;
  @IsString()
  to: string;
  @IsInt()
  tokenId: number;

  static of(transfer: Transfer[]): TransferEventDto {
    return {
      transfer: transfer.map((t) => {
        if (t === undefined) {
          throw new InternalServerErrorException(
            `No transfer event found for tokenId ${t.tokenId}`,
          );
        }
        return {
          from: t.from,
          to: t.to,
          tokenId: t.tokenId,
          blockNumber: t.blockNumber,
        };
      }),
    };
  }
}
