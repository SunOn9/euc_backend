import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { EnumProto_SessionStatus } from '/generated/enumps'
import { PaymentSessionEntity } from '../entities/paymentSession.entity'
import { PaymentSession } from '/generated/paymentSession/paymentSession'

@Injectable()
export class PaymentSessionReflect {
  reflect(entity: PaymentSessionEntity): PaymentSession {
    const reflect = PaymentSession.create()
    reflect.id = entity.id ?? 0
    reflect.title = entity.title ?? ''
    reflect.description = entity.description ?? ''
    reflect.status = entity.status ?? EnumProto_SessionStatus.UNRECOGNIZED
    reflect.fundAmount = entity.fundAmount ?? 0
    reflect.amount = entity.amount ?? 0
    reflect.dateConfirm = entity.dateConfirm ?? null
    reflect.dateDone = entity.dateDone ?? null
    reflect.userConfirm = entity.userConfirm ?? null
    reflect.userDone = entity.userDone ?? null
    reflect.payment = entity.payment ?? []
    reflect.event = entity.event ?? null
    reflect.club = entity.club ?? null
    reflect.createdAt = entity.createdAt ?? null
    reflect.updatedAt = entity.updatedAt ?? null
    reflect.deletedAt = entity.deletedAt ?? null
    return reflect
  }
}
