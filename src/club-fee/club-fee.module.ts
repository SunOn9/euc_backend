import { ClubFeeService } from './club-fee.service'
import { ClubFeeController } from './club-fee.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'

@Module({
  controllers: [ClubFeeController],
  providers: [ClubFeeService],
})
export class ClubFeeModule {}
