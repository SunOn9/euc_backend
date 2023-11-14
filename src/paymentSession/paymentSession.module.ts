import { PaymentSessionService } from './paymentSession.service'
import { PaymentSessionController } from './paymentSession.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { PermissionModule } from '/permission/permission.module'
import { PaymentModule } from '/payment/payment.module'
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module'
import { PaymentSessionEntity } from './entities/paymentSession.entity'
import { PaymentSessionReflect } from './provider/paymentSession.proto'
import { PaymentSessionRepository } from './provider/paymentSession.repository'
import { ClubModule } from '/club/club.module'
import { forwardRef } from '@nestjs/common/utils/forward-ref.util'

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentSessionEntity]),
    PermissionModule,
    forwardRef(() => PaymentModule),
    ClubModule,
  ],
  controllers: [PaymentSessionController],
  providers: [
    PaymentSessionService,
    PaymentSessionReflect,
    PaymentSessionRepository,
  ],
  exports: [
    PaymentSessionService,
    PaymentSessionReflect,
    PaymentSessionRepository,
  ],
})
export class PaymentSessionModule {}
