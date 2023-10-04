import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { ClubEntity } from '../entities/club.entity'
import { Club } from '/generated/club/club'

@Injectable()
export class ClubReflect {
  reflect(entity: ClubEntity): Club {
    const reflect = Club.create()
    reflect.id = entity.id ?? 0
    reflect.name = entity.name ?? ''
    reflect.fund = entity.fund = 0
    reflect.totalMember = entity.totalMember = 0
    reflect.createdAt = entity.createdAt ?? null
    reflect.updatedAt = entity.updatedAt ?? null
    reflect.deletedAt = entity.deletedAt ?? null
    reflect.fee = entity.fee ?? null
    reflect.area = entity.area ?? null
    return reflect
  }
}
