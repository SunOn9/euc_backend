import { Module } from '@nestjs/common';
import { PaymentSessionService } from './payment-session.service';
import { PaymentSessionController } from './payment-session.controller';

@Module({
  controllers: [PaymentSessionController],
  providers: [PaymentSessionService],
})
export class PaymentSessionModule {}
