import { PaymentService } from './payment.service'
import { PaymentController } from './payment.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
