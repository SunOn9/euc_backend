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

    const sessionID = this.extractSessionIDFromRequest(request)

    const session = await this.sessionService.get(sessionID)

    if (session.isErr()) {
      return false
    }

    request['userInfo'] = session.value
    request['sessionId'] = sessionID

    return true
  }

  extractSessionIDFromRequest(request: any): string {
    const connectSidHeader = request.rawHeaders.find(
      (header: string | string[]) => header.includes('connect.sid'),
    )
    let reply = null

    if (connectSidHeader) {
      const connectSidIndex = connectSidHeader.indexOf('=') + 1
      const connectSid = connectSidHeader.slice(connectSidIndex)
      reply = connectSid.split('.')[0].slice(4)
    }

    return reply
  }
}
