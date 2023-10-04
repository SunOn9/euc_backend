import { ReceiptService } from './receipt.service'
import { ReceiptController } from './receipt.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'

@Module({
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptModule {}
