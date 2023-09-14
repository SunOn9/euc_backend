import { Module } from '@nestjs/common';
import { ClubFeeService } from './club-fee.service';
import { ClubFeeController } from './club-fee.controller';

@Module({
  controllers: [ClubFeeController],
  providers: [ClubFeeService],
})
export class ClubFeeModule {}
