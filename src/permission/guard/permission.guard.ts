import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSION_CHECKER_KEY } from "./permission.decorator";
import { CaslAbilityFactory } from './../casl/casl-ability.factory'
import { MongoAbility } from "@casl/ability/dist/types/Ability";
import { AbilityTuple } from "@casl/ability/dist/types/types";
import { MongoQuery } from "@casl/ability/dist/types/matchers/conditions";
import { RawRule } from "../casl/rules";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private abilityFactory: CaslAbilityFactory) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.get<RawRule[]>(PERMISSION_CHECKER_KEY, context.getHandler()) || [];

    const request = context.switchToHttp().getRequest();

    const sessionID = this.extractSessionIDFromRequest(request)

    const ability = await this.abilityFactory.defineAbility(sessionID);

    return requiredPermissions.every(permission => this.isAllowed(ability, permission));
  }

  private isAllowed(ability: MongoAbility<AbilityTuple, MongoQuery>, permission: RawRule): boolean {
    if (permission.fields.length === 0) {
      return permission.action.every(action =>
        permission.subject.every(subject =>
          ability.can(action, subject)
        )
      );
    } else {
      return permission.action.every(action =>
        permission.subject.every(subject =>
          permission.fields.every(field =>
            ability.can(action, subject, field)
          )
        )
      );
    }
  }

  extractSessionIDFromRequest(request: any): string {
    const connectSidHeader = request.rawHeaders.find(
      (header: string | string[]) => header.includes('connect.sid'),
    )
    let connectSid = null
    if (connectSidHeader) {
      const connectSidIndex = connectSidHeader.indexOf('=') + 1
      connectSid = connectSidHeader.slice(connectSidIndex)
    }
    return (connectSid.split('.')[0].slice(4))
  }
}