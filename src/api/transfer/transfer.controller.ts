import { Controller, Body, Post, Get } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferHistoryDto } from './dto/transfer-history.dto';
import { RegisterTransferTxPayload } from './payload/register-transfer-tx.payload';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}
  @Post('add')
  @ApiOperation({ summary: 'Register Transfer Event' })
  @ApiResponse({ type: TransferHistoryDto })
  async getTransfer(@Body() { txHash }: RegisterTransferTxPayload) {
    const transfer = await this.transferService.addTransfer(txHash);
  }
}
