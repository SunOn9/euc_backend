import { Injectable } from '@nestjs/common'
import { PermissionEntity } from '../entities/permission.entity'
import { Permission } from '/generated/permission/permission'

@Injectable()
export class PermissionReflect {
  reflect(entity: PermissionEntity): Permission {
    const reflect = Permission.create()
    reflect.id = entity.id ?? 0
    reflect.name = entity.name ?? ''
    reflect.rules = entity.rules ?? null
    reflect.createdAt = entity.createdAt ?? null
    reflect.updatedAt = entity.updatedAt ?? null
    reflect.deletedAt = entity.deletedAt ?? null
    reflect.user = entity.user ?? null
    return reflect
  }
}
