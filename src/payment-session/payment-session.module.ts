import { PaymentSessionService } from './payment-session.service'
import { PaymentSessionController } from './payment-session.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'

@Module({
  controllers: [PaymentSessionController],
  providers: [PaymentSessionService],
})
export class PaymentSessionModule {}
