import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { AreaEntity } from '../entities/area.entity'
import { Area } from '/generated/area/area'

@Injectable()
export class AreaReflect {
  reflect(entity: AreaEntity): Area {
    const reflect = Area.create()
    reflect.id = entity.id ?? 0
    reflect.name = entity.name ?? ''
    reflect.slug = entity.slug ?? ''
    reflect.createdAt = entity.createdAt ?? null
    reflect.updatedAt = entity.updatedAt ?? null
    reflect.deletedAt = entity.deletedAt ?? null
    reflect.club = entity.club ?? null
    reflect.member = entity.member ?? null
    return reflect
  }
}
