import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { SessionService } from '/session/session.service'
import { Reflector } from '@nestjs/core'

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
