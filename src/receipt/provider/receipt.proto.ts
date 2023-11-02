import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'

import { EnumProto_MoneyMethod } from '/generated/enumps'
import { ReceiptEntity } from '../entities/receipt.entity'
import { Receipt } from '/generated/receipt/receipt'

@Injectable()
export class ReceiptReflect {
  reflect(entity: ReceiptEntity): Receipt {
    const reflect = Receipt.create()
    reflect.id = entity.id ?? 0
    reflect.title = entity.title ?? ''
    reflect.description = entity.description ?? ''
    reflect.amount = entity.amount ?? 0
    reflect.hiddenId = entity.hiddenId ?? 0
    reflect.fundAmount = entity.fundAmount ?? 0
    reflect.method = entity.method ?? EnumProto_MoneyMethod.UNRECOGNIZED
    reflect.receiptSession = entity.receiptSession ?? null
    reflect.createdAt = entity.createdAt ?? null
    reflect.updatedAt = entity.updatedAt ?? null
    reflect.deletedAt = entity.deletedAt ?? null
    return reflect
  }
}
