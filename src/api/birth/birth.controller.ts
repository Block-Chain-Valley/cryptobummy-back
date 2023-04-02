import {
  Controller,
  ParseIntPipe,
  Post,
  Get,
  Param,
  Body,
} from '@nestjs/common';
import {
  BirthHistoryDto,
  BirthHistoryListDto,
  BirthHistoryResultDto,
} from './dto/birth-history.dto';
import { BirthService } from './birth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterBirthTxPayload } from './payload/register-birth-tx.payload';

@Controller('birth')
export class BirthController {
  constructor(private readonly birthService: BirthService) {}
  @Post('tx/mint/add')
  @ApiOperation({ summary: 'Post birth event by txHash' })
  @ApiResponse({ type: BirthHistoryResultDto })
  async postMintTransaction(@Body() { txHash }: RegisterBirthTxPayload) {
    //Payload를 쓰는 이유는, 원하는 데이터 형태로 받기 위해서
    return this.birthService.addBirthEvent(txHash);
  }

  @Get('tx/mint/get/:BummyId')
  @ApiOperation({ summary: 'Get birth transaction by BummyId' })
  @ApiResponse({ type: BirthHistoryDto })
  async getMintTransaction(
    @Param('BummyId') BummyId: string,
  ): Promise<BirthHistoryDto> {
    return this.birthService.getBirthEvent(BummyId);
  }
  @Get('tx/mint/gets/:owner')
  @ApiOperation({ summary: 'Get birth transaction by owner' })
  @ApiResponse({ type: BirthHistoryListDto })
  async getMintTransactions(
    @Param('owner') owner: string,
  ): Promise<BirthHistoryListDto> {
    return this.birthService.getBirthEvents(owner);
  }
}

// 1. front-end에서 (txHash와 address)를 제공하면 이에 해당하는 event를 찾아서 db에 저장
//     -> address는 필요없을지도?
// 2. front-end에서 mint에 대한 정보를 요청하면 db에서 해당 정보를 가져옴
// 2-1. 전부 가져오기
// 2-2. 특정 BummyId에 대한 정보만 가져오기
