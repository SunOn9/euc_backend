import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { SessionService } from '/session/session.service'
import { Reflector } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
@Injectable()
export class AthenticatedGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()

    const allowUnauthorizedRequest = this.reflector.get<boolean>(
      'allowUnauthorizedRequest',
      context.getHandler(),
    )

    if (allowUnauthorizedRequest) {
      return true
    }

    // const rawHeader = cookieParser.parse(request.rawHeaders)

    // console.log(rawHeader)
    // const session = await this.sessionService.get()
    // if (session.isErr()) {
    //   return false
    // }

    return true
  }
}
