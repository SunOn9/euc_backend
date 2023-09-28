import { Auth } from '../../generated/auth/auth'
import { AuthEntity } from '../entities/auth.entity'
import { Injectable } from '@nestjs/common'
@Injectable()
export class AuthReflect {
  reflect(entity: AuthEntity): Auth {
    const reflect = Auth.create()
    reflect.id = entity.id ?? 0
    reflect.ipAddress = entity.ipAddress ?? ''
    reflect.authToken = entity.authToken ?? ''
    reflect.platform = entity.platform ?? ''
    reflect.sessionId = entity.sessionId ?? ''
    reflect.userAgent = entity.userAgent ?? ''
    reflect.longtitude = entity.longtitude ?? 0
    reflect.latitude = entity.latitude ?? 0
    reflect.createdAt = entity.createdAt ?? null
    reflect.user = entity.user ?? null
    return reflect
  }
}
