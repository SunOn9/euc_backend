import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { EnumProto_MoneyMethod, EnumProto_SessionStatus } from '/generated/enumps'
import { PaymentSessionEntity } from '../entities/payment-session.entity'
import { PaymentSession, PaymentSession_Event, PaymentSession_Payment, PaymentSession_User } from '/generated/payment-session/payment-session'


@Injectable()
export class PaymentSessionReflect {
  reflect(entity: PaymentSessionEntity): PaymentSession {
    const reflect = PaymentSession.create()
    reflect.id = entity.id ?? 0
    reflect.title = entity.title ?? ''
    reflect.description = entity.description ?? ''
    reflect.status = entity.status ?? EnumProto_SessionStatus.UNRECOGNIZED
    reflect.dateConfirm = entity.dateConfirm ?? null
    reflect.dateDone = entity.dateDone ?? null
    reflect.userConfirm = entity.userConfirm ?? null
    reflect.userDone = entity.userDone ?? null
    reflect.payment = entity.payment ?? []
    reflect.event = entity.event ?? null
    reflect.createdAt = entity.createdAt ?? null
    reflect.updatedAt = entity.updatedAt ?? null
    reflect.deletedAt = entity.deletedAt ?? null
    return reflect
  }
}
