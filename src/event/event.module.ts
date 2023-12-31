import { EventService } from './event.service'
import { EventController } from './event.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { EventReflect } from './provider/event.proto'
import { EventRepository } from './provider/event.repository'
import { EventEntity } from './entities/event.entity'
import { PermissionModule } from '/permission/permission.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MemberModule } from '/member/member.module'
import { GuestModule } from '/guest/guest.module'
import { PaymentSessionModule } from '../paymentSession/paymentSession.module'
import { ReceiptSessionModule } from '../receiptSession/receiptSession.module'
import { PaymentModule } from '/payment/payment.module'
import { ReceiptModule } from '/receipt/receipt.module'
import { ClubModule } from '/club/club.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity]),
    PermissionModule,
    MemberModule,
    GuestModule,
    ClubModule,
    PaymentSessionModule,
    PaymentModule,
    ReceiptSessionModule,
    ReceiptModule,
  ],
  controllers: [EventController],
  providers: [EventService, EventReflect, EventRepository],
})
export class EventModule {}
