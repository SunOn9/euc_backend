import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface'
import { AuthGuard } from '@nestjs/passport'

export class LoginGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean
    const request = context.switchToHttp().getRequest()
    await super.logIn(request)
    return result
  }
}
