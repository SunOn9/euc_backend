import { PassportSerializer } from '@nestjs/passport'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, user)
  }

  deserializeUser(
    payload: any,
    done: (err: Error, payload: string) => void,
  ): any {
    done(null, payload)
  }
}
