import { Controller, ParseIntPipe, Post } from '@nestjs/common';
import { BirthHistoryDto } from './dto/birth-history.dto';
import { BirthService } from './birth.service';

@Controller('birth')
export class BirthController {
  constructor(private readonly birthService: BirthService) {}
  @Post('tx/mint/add/:txHash')
  @ApiOperation({ summary: 'Post birth event by txHash' })
  @ApiResponse({ type: BirthHistoryDto })
  async postMintTransaction(
    @Param('txHash', ParseIntPipe) txHash: number,
  ): Promise<BirthHistoryDto> {
    return this.birthService.addBirthEvent(txHash);
  }
  @Get('tx/mint/get/:BummyId')
  @ApiOperation({ summary: 'Get birth transaction by BummyId' })
  @ApiResponse({ type: BirthHistoryDto })
  async getMintTransaction(
    @Param('BummyId', ParseIntPipe) BummyId: number,
  ): Promise<BirthHistoryDto> {
    return this.birthService.getBirthEvent(BummyId);
  }
  @Get('tx/mint/gets/:owner')
  @ApiOperation({ summary: 'Get birth transaction by owner' })
  @ApiResponse({ type: [BirthHistoryDto] })
  async getMintTransactions(
    @Param('owner', ParseIntPipe) owner: string,
  ): Promise<BirthHistoryDto[]> {
    return this.birthService.getBirthEvents(owner);
  }
}

// 1. front-end에서 (txHash와 address)를 제공하면 이에 해당하는 event를 찾아서 db에 저장
//     -> address는 필요없을지도?
// 2. front-end에서 mint에 대한 정보를 요청하면 db에서 해당 정보를 가져옴
// 2-1. 전부 가져오기
// 2-2. 특정 BummyId에 대한 정보만 가져오기
