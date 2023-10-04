import { ReceiptSessionService } from './receipt-session.service'
import { ReceiptSessionController } from './receipt-session.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'

@Module({
  controllers: [ReceiptSessionController],
  providers: [ReceiptSessionService],
})
export class ReceiptSessionModule {}
