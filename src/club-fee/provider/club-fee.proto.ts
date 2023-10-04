import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { ClubFeeEntity } from '../entities/club-fee.entity'
import { ClubFee } from '/generated/club-fee/club-fee'

@Injectable()
export class ClubFeeReflect {
  reflect(entity: ClubFeeEntity): ClubFee {
    const reflect = ClubFee.create()
    reflect.id = entity.id ?? 0
    reflect.studentFee = entity.studentFee ?? 0
    reflect.workerFee = entity.workerFee ?? 0
    reflect.monthlyFee = entity.monthlyFee ?? 0
    reflect.createdAt = entity.createdAt ?? null
    reflect.deletedAt = entity.deletedAt ?? null
    reflect.club = entity.club ?? null
    return reflect
  }
}
