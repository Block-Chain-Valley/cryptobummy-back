import { ApiProperty } from '@nestjs/swagger';
import { isString } from 'class-validator';
import { constants } from 'ethers';

export class RegisterBirthTxPayload {
  @ApiProperty({
    type: String,
    title: 'Transaction Hash',
    example: constants.HashZero,
  })
  txHash: string;
  // @ApiProperty({
  //   type: String,
  //   title: 'Address',
  //   example: constants.AddressZero,
  // })
  // address: string;
}

export class getBirthTxPayload {
  @ApiProperty({
    type: String,
    title: 'BummyId',
    example: '0x12341251',
  })
  BummyId: string;
}
