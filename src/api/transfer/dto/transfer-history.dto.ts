import { IsString, IsNotEmpty } from 'class-validator';

export class TransferHistoryDto {
  @IsString()
  @IsNotEmpty()
  txHash: string;
}
