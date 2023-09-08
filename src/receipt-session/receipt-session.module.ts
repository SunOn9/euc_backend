import { Module } from '@nestjs/common';
import { ReceiptSessionService } from './receipt-session.service';
import { ReceiptSessionController } from './receipt-session.controller';

@Module({
  controllers: [ReceiptSessionController],
  providers: [ReceiptSessionService],
})
export class ReceiptSessionModule {}
