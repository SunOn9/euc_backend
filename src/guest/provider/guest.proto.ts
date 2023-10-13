import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Guest } from '/generated/guest/guest'
import { GuestEntity } from '../entities/guest.entity'
import { EnumProto_MemberType } from '/generated/enumps'

@Injectable()
export class GuestReflect {
  reflect(entity: GuestEntity): Guest {
    const reflect = Guest.create()
    reflect.id = entity.id ?? 0
    reflect.name = entity.name ?? ''
    reflect.nickName = entity.nickName ?? ''
    reflect.type = entity.type ?? EnumProto_MemberType.UNRECOGNIZED
    reflect.createdAt = entity.createdAt ?? null
    reflect.updatedAt = entity.updatedAt ?? null
    reflect.deletedAt = entity.deletedAt ?? null
    reflect.club = entity.club ?? null
    reflect.event = entity.event ?? null
    return reflect
  }
}
