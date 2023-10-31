import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'

import {
  EnumProto_Gender,
  EnumProto_MemberStatus,
  EnumProto_MemberType,
} from '/generated/enumps'
import { Member } from '/generated/member/member'
import { MemberEntity } from '../entities/member.entity'

@Injectable()
export class MemberReflect {
  reflect(entity: MemberEntity): Member {
    const reflect = Member.create()
    reflect.id = entity.id ?? 0
    reflect.name = entity.name ?? ''
    reflect.nickName = entity.nickName ?? ''
    reflect.gender = entity.gender ?? EnumProto_Gender.UNRECOGNIZED
    reflect.birthday = entity.birthday ?? null
    reflect.status = entity.status ?? EnumProto_MemberStatus.UNRECOGNIZED
    reflect.monthlyFee = entity.monthlyFee ?? ''
    reflect.type = entity.type ?? EnumProto_MemberType.UNRECOGNIZED
    reflect.createdAt = entity.createdAt ?? null
    reflect.updatedAt = entity.updatedAt ?? null
    reflect.deletedAt = entity.deletedAt ?? null
    reflect.memberInClub = entity.memberInClub ?? []
    reflect.event = entity.event ?? []
    reflect.hometown = entity.hometown ?? null
    return reflect
  }
}
