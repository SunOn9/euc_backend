import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { UserEntity } from '../entities/user.entity'
import { User } from '/generated/user/user'
import { EnumProto_UserRole } from '/generated/enumps'

@Injectable()
export class UserReflect {
  reflect(entity: UserEntity): User {
    const reflect = User.create()
    reflect.id = entity.id ?? 0
    reflect.name = entity.name ?? ''
    reflect.email = entity.email ?? ''
    reflect.password = entity.password ?? ''
    reflect.phone = entity.phone ?? ''
    reflect.role = entity.role ?? EnumProto_UserRole.UNRECOGNIZED
    reflect.createdAt = entity.createdAt ?? null
    reflect.updatedAt = entity.updatedAt ?? null
    reflect.deletedAt = entity.deletedAt ?? null
    reflect.auth = entity.auth ?? []
    reflect.permission = entity.permission ?? []
    reflect.club = entity.club ?? null
    return reflect
  }
}
