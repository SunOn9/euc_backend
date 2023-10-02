import { HttpStatus, Injectable } from '@nestjs/common'
import {
  AbilityBuilder,
  AbilityTuple,
  ExtractSubjectType,
  MongoAbility,
  MongoQuery,
  createMongoAbility,
} from '@casl/ability'
import { RawRule } from './rules'
import { SessionService } from '/session/session.service'
import CustomException from 'lib/utils/custom.exception'
import { EnumProto_UserRole } from '/generated/enumps'
import { Action, Subject } from './casl.type'

type AppAbility = MongoAbility<[Action, Subject]>

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly sessionService: SessionService) {}

  async defineAbility(
    sessionId: string,
  ): Promise<MongoAbility<AbilityTuple, MongoQuery>> {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    )

    const user = await this.sessionService.get(sessionId)

    if (user.isErr()) {
      throw new CustomException(
        'ERROR',
        `Unvalid sessionId`,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (user.value.role === EnumProto_UserRole.ADMIN) {
      can(Action.MANAGE, 'all')
      return build({
        detectSubjectType: item =>
          item.constructor as ExtractSubjectType<Subject>,
      })
    }

    const rawRules: RawRule[] = user.value.permission.map(each => each.rules)

    rawRules.map(each => {
      const subjects = each.subject.map(
        subject => subject as ExtractSubjectType<Subject>,
      )

      if (each.inverted === true) {
        cannot(each.action, subjects, each.fields, each.conditions).because(
          each.reason,
        )
      } else {
        can(each.action, subjects, each.fields, each.conditions)
      }
    })

    return build({
      detectSubjectType: item =>
        item.constructor as ExtractSubjectType<Subject>,
    })
  }
}
