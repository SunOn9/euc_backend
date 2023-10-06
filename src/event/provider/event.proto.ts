import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { EventEntity } from '../entities/event.entity'
import { Event } from '/generated/event/event'
import { EnumProto_EventType } from '/generated/enumps'
@Injectable()
export class EventReflect {
  reflect(entity: EventEntity): Event {
    const reflect = Event.create()
    reflect.id = entity.id ?? 0
    reflect.name = entity.name ?? ''
    reflect.startEventDate = entity.startEventDate ?? null
    reflect.endEventDate = entity.endEventDate ?? null
    reflect.type = entity.type ?? EnumProto_EventType.UNRECOGNIZED
    reflect.createdAt = entity.createdAt ?? null
    reflect.updatedAt = entity.updatedAt ?? null
    reflect.deletedAt = entity.deletedAt ?? null
    reflect.member = entity.member ?? []
    reflect.guest = entity.guest ?? []
    reflect.paymentSession = entity.paymentSession ?? []
    reflect.receiptSession = entity.receiptSession ?? []
    reflect.place = entity.place ?? null
    return reflect
  }
}
