import { ApiProperty } from '@nestjs/swagger';
import { constants } from 'ethers';
import { Birth } from '@prisma/client';

export class BirthHistoryDto {
  @ApiProperty({ type: String, example: constants.AddressZero })
  readonly owner: string;
  @ApiProperty({ type: Number, example: 123123 })
  readonly BummyId: number;
  @ApiProperty({ type: Number, example: 123123 })
  readonly momId: number;
  @ApiProperty({ type: Number, example: 123123 })
  readonly dadId: number;
  @ApiProperty({ type: Number, example: 123123 })
  readonly genes: number;
}
