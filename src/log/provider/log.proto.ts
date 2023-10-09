import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { LogEntity } from '../entities/log.entity'
import { Log } from '/generated/log/log'

@Injectable()
export class LogReflect {
  reflect(entity: LogEntity): Log {
    const reflect = Log.create()
    reflect.id = entity.id ?? 0
    reflect.subject = entity.subject ?? ''
    reflect.action = entity.action ?? ''
    reflect.oldData = entity.oldData ?? null
    reflect.newData = entity.newData ?? null
    reflect.createdAt = entity.createdAt ?? null
    reflect.sessionId = entity.sessionId = ''
    reflect.user = entity.user ?? null
    return reflect
  }
}
