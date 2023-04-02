import { ApiProperty } from '@nestjs/swagger';
import { constants } from 'ethers';
import { Bummy } from '@prisma/client';
import { InternalServerErrorException } from '@nestjs/common';

export class BirthHistoryDto {
  @ApiProperty({ type: String, example: constants.AddressZero })
  readonly owner: string;
  @ApiProperty({ type: Number, example: 123123 })
  readonly blockNumber: number;
  @ApiProperty({ type: Date, example: '2021-10-10T10:10:10.000Z' })
  readonly createdAt: Date;
  @ApiProperty({ type: String, example: '123123' })
  readonly BummyId: string;
  @ApiProperty({ type: String, example: '123123' })
  readonly momId: string;
  @ApiProperty({ type: String, example: '123123' })
  readonly dadId: string;
  @ApiProperty({ type: String, example: '123123' })
  readonly genes: string;

  static of(bummy: Bummy): BirthHistoryDto {
    if (bummy === undefined) {
      throw new InternalServerErrorException(
        `No birth event found for BummyId ${bummy.BummyId}`,
      );
    }
    return {
      owner: bummy.owner,
      blockNumber: bummy.blockNumber,
      createdAt: bummy.createdAt,
      BummyId: bummy.BummyId,
      momId: bummy.momId,
      dadId: bummy.dadId,
      genes: bummy.genes,
    };
  }
}

export class BirthHistoryListDto {
  @ApiProperty({ title: 'Mint history', type: [BirthHistoryDto] })
  history: BirthHistoryDto[];

  // @ApiProperty({ title: 'Total mint count', type: Number, example: 30 })
  // totalCount: number;

  static of(history: Bummy[]): BirthHistoryListDto {
    return {
      history: history.map((h) => {
        if (h === undefined) {
          throw new InternalServerErrorException(
            `No birth event found for BummyId ${h.BummyId}`,
          );
        }
        return {
          owner: h.owner,
          blockNumber: h.blockNumber,
          createdAt: h.createdAt,
          BummyId: h.BummyId,
          momId: h.momId,
          dadId: h.dadId,
          genes: h.genes,
        };
      }),
    };
  }

  // static of(historyInfo: Birth[], totalCount: number): BirthHistoryListDto {
  //   return {
  //     history: historyInfo.map(BirthHistoryDto.of),
  //     totalCount,
  //   };
  // }
}

export class BirthHistoryResultDto {
  @ApiProperty({ title: 'Mint history', type: [BirthHistoryDto] })
  history: BirthHistoryDto[];

  @ApiProperty({ title: 'Total mint count', type: Number, example: 30 })
  totalCount: number;

  static of(
    historyInfo: BirthHistoryDto[],
    totalCount: number,
  ): BirthHistoryResultDto {
    return {
      history: historyInfo,
      totalCount,
    };
  }
}
