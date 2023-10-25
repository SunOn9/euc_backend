import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { PaymentEntity } from '../entities/payment.entity'
import { Payment } from '/generated/payment/payment'
import { EnumProto_MoneyMethod } from '/generated/enumps'


@Injectable()
export class PaymentReflect {
  reflect(entity: PaymentEntity): Payment {
    const reflect = Payment.create()
    reflect.id = entity.id ?? 0
    reflect.title = entity.title ?? ''
    reflect.description = entity.description ?? ''
    reflect.amount = entity.amount ?? 0
    reflect.method = entity.method ?? EnumProto_MoneyMethod.UNRECOGNIZED
    reflect.paymentSession = entity.paymentSession ?? null
    reflect.createdAt = entity.createdAt ?? null
    reflect.updatedAt = entity.updatedAt ?? null
    reflect.deletedAt = entity.deletedAt ?? null
    return reflect
  }
}
