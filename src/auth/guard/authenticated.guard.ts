import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { SessionService } from '/session/session.service'
import { Reflector } from '@nestjs/core'
import { CanActivate } from '@nestjs/common/interfaces/features/can-activate.interface'
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface'

@Injectable()
export class AthenticatedGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessionService: SessionService,
  ) { }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()

    const allowUnauthorizedRequest = this.reflector.get<boolean>(
      'allowUnauthorizedRequest',
      context.getHandler(),
    )

    if (allowUnauthorizedRequest) {
      return true
    }

    const sessionID = this.extractSessionIDFromHeader(request)

    const session = await this.sessionService.get(sessionID)

    if (session.isErr()) {
      return false
    }

    request['userInfo'] = session.value
    request['sessionId'] = sessionID

    return true
  }

  extractSessionIDFromHeader(request: any): string {
    return request.headers['sessionid']
  }
}
