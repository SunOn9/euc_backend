import { Injectable } from '@nestjs/common'
import { SessionEntity } from '../entities/session.entity'
import { Session } from '/generated/session/session'

@Injectable()
export class SessionReflect {
  reflect(entity: SessionEntity): Session {
    const reflect = Session.create()
    reflect.id = entity.id ?? ''
    reflect.expireDate = entity.expireDate ?? null
    reflect.userInfo = entity.userInfo ?? null
    return reflect
  }
}
