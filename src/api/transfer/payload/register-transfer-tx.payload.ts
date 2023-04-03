import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterTransferTxPayload {
  @ApiProperty({
    title: 'Transaction Hash',
    type: String,
    example: '0x1234567890',
  })
  @IsString()
  @IsNotEmpty()
  txHash: string;
}
