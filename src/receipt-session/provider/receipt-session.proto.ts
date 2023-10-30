import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { EnumProto_SessionStatus } from '/generated/enumps'
import { ReceiptSessionEntity } from '../entities/receipt-session.entity'
import { ReceiptSession } from '/generated/receipt-session/receipt-session'

@Injectable()
export class ReceiptSessionReflect {
  reflect(entity: ReceiptSessionEntity): ReceiptSession {
    const reflect = ReceiptSession.create()
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
    reflect.receipt = entity.receipt ?? []
    reflect.event = entity.event ?? null
    reflect.club = entity.club ?? null
    reflect.createdAt = entity.createdAt ?? null
    reflect.updatedAt = entity.updatedAt ?? null
    reflect.deletedAt = entity.deletedAt ?? null
    return reflect
  }
}
