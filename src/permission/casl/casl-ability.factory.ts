import { HttpStatus, Injectable } from '@nestjs/common'
import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { RawRule } from './rules'
import { SessionService } from '/session/session.service'
import CustomException from 'lib/utils/custom.exception'

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly sessionService: SessionService) { }

  async defineAbility(sessionId: string) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility)

    const user = await this.sessionService.get(sessionId)

    if (user.isErr()) {
      throw new CustomException(
        'ERROR',
        `Unvalid sessionId`,
        HttpStatus.BAD_REQUEST,
      )
    }

    const rawRules: RawRule[] = user.value.permission.map(each => each.rules)

    rawRules.map(each => {
      if (each.inverted === true) {
        cannot(each.action, each.subject, each.fields, each.conditions).because(
          each.reason,
        )
      } else {
        can(each.action, each.subject, each.fields, each.conditions)
      }
    })

    return build()
  }
}
