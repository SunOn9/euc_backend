import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { PlaceEntity } from '../entities/place.entity'
import { Place } from '/generated/place/place'

@Injectable()
export class PlaceReflect {
  reflect(entity: PlaceEntity): Place {
    const reflect = Place.create()
    reflect.id = entity.id ?? 0
    reflect.name = entity.name ?? ''
    reflect.fee = entity.fee ?? 0
    reflect.address = entity.address ?? ''
    reflect.createdAt = entity.createdAt ?? null
    reflect.updatedAt = entity.updatedAt ?? null
    reflect.deletedAt = entity.deletedAt ?? null
    return reflect
  }
}
