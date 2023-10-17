import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'

import { EnumProto_MemberType } from '/generated/enumps'
import { Member } from '/generated/member/member'
import { MemberEntity } from '../entities/member.entity'

@Injectable()
export class MemberReflect {
  reflect(entity: MemberEntity): Member {
    const reflect = Member.create()
    reflect.id = entity.id ?? 0
    reflect.name = entity.name ?? ''
    reflect.nickName = entity.nickName ?? ''
    reflect.type = entity.type ?? EnumProto_MemberType.UNRECOGNIZED
    reflect.createdAt = entity.createdAt ?? null
    reflect.updatedAt = entity.updatedAt ?? null
    reflect.deletedAt = entity.deletedAt ?? null
    reflect.memberInClub = entity.memberInClub ?? []
    reflect.event = entity.event ?? []
    return reflect
  }
}
