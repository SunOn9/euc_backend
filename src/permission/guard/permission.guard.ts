import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Reflector } from '@nestjs/core'
import { PERMISSION_CHECKER_KEY } from './permission.decorator'
import { CaslAbilityFactory } from './../casl/casl-ability.factory'
import { MongoAbility } from '@casl/ability/dist/types/Ability'
import { AbilityTuple } from '@casl/ability/dist/types/types'
import { MongoQuery } from '@casl/ability/dist/types/matchers/conditions'
import { RawRule } from '../casl/rules'
import { CanActivate } from '@nestjs/common/interfaces/features/can-activate.interface'
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.get<RawRule[]>(
        PERMISSION_CHECKER_KEY,
        context.getHandler(),
      ) || []

    const request = context.switchToHttp().getRequest()

    const sessionID = this.extractSessionIDFromHeader(request)

    const ability = await this.abilityFactory.defineAbility(sessionID)

    return requiredPermissions.every(permission =>
      this.isAllowed(ability, permission),
    )
  }

  private isAllowed(
    ability: MongoAbility<AbilityTuple, MongoQuery>,
    permission: RawRule,
  ): boolean {
    if (permission.fields.length === 0) {
      return permission.action.every(action =>
        permission.subject.every(subject => ability.can(action, subject)),
      )
    } else {
      return permission.action.every(action =>
        permission.subject.every(subject =>
          permission.fields.every(field => ability.can(action, subject, field)),
        ),
      )
    }
  }

  extractSessionIDFromHeader(request: any): string {
    return request.headers['sessionid']
  }
}
