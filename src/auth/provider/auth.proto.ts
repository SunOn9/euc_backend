import { Auth } from '../../generated/auth/auth';
import { AuthEntity } from '../entities/auth.entity';
import { Injectable } from '@nestjs/common';
@Injectable()
export class AuthReflect {
  reflect(entity: AuthEntity): Auth {
    const reflect = Auth.create();
    reflect.id = entity.id ?? 0;
    reflect.userId = entity.user.id ?? 0;
    reflect.ipAddress = entity.ipAddress ?? '';
    reflect.authToken = entity.authToken ?? '';
    reflect.platform = entity.platform ?? '';
    reflect.sessionId = entity.sessionId ?? '';
    reflect.userAgent = entity.userAgent ?? '';
    reflect.longtitude = entity.longtitude ?? 0;
    reflect.latitude = entity.latitude ?? 0;
    reflect.createAt = entity.createdAt ?? 0;
    return reflect;
  }
}
