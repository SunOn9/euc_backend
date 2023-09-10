import { Module } from '@nestjs/common';
import { MemberFeeService } from './member-fee.service';
import { MemberFeeController } from './member-fee.controller';

@Module({
  controllers: [MemberFeeController],
  providers: [MemberFeeService],
})
export class MemberFeeModule {}
