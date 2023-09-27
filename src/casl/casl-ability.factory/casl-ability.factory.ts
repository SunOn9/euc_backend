import {
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability/dist/types/types'
import { Ability } from '@casl/ability/dist/types/Ability'
import { Action } from '/prelude/enum'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { AbilityBuilder } from '@casl/ability/dist/types/AbilityBuilder'
import { AbilityClass } from '@casl/ability/dist/types/PureAbility'
import { EnumProto_UserRole } from '/generated/enumps'
//ENTITY
import { AreaEntity } from '/area/entities/area.entity'
import { UserEntity } from '/user/entities/user.entity'
import { AuthEntity } from '/auth/entities/auth.entity'
import { ClubEntity } from '/club/entities/club.entity'
import { ClubFeeEntity } from '/club-fee/entities/club-fee.entity'
import { EventEntity } from '/event/entities/event.entity'
import { GuestEntity } from '/guest/entities/guest.entity'
import { LogEntity } from '/log/entities/log.entity'
import { MemberEntity } from '/member/entities/member.entity'
import { MemberInClubEntity } from '/member-in-club/entities/member-in-club.entity'
import { PaymentEntity } from '/payment/entities/payment.entity'
import { PaymentSessionEntity } from '/payment-session/entities/payment-session.entity'
import { ReceiptEntity } from '/receipt/entities/receipt.entity'
import { ReceiptSessionEntity } from '/receipt-session/entities/receipt-session.entity'
import { SessionEntity } from '/session/entities/session.entity'
import { PlaceEntity } from '/place/entities/place.entity'

type Subjects =
  | InferSubjects<
      | typeof AreaEntity
      | typeof AuthEntity
      | typeof ClubEntity
      | typeof ClubFeeEntity
      | typeof EventEntity
      | typeof GuestEntity
      | typeof LogEntity
      | typeof MemberEntity
      | typeof MemberInClubEntity
      | typeof PaymentEntity
      | typeof PaymentSessionEntity
      | typeof PlaceEntity
      | typeof ReceiptEntity
      | typeof ReceiptSessionEntity
      | typeof SessionEntity
      | typeof UserEntity
    >
  | 'all'

export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserEntity) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>)

    if (user.role === EnumProto_UserRole.ADMIN) {
      can(Action.Manage, 'all')
    }

    if (user.role === EnumProto_UserRole.STAFF) {
      can(Action.Manage, [
        UserEntity,
        MemberEntity,
        MemberInClubEntity,
        GuestEntity,
        EventEntity,
      ])
      can(Action.Read, [PaymentSessionEntity, ReceiptSessionEntity], {
        event: { club: user.club },
      })
      cannot(Action.Manage, [AuthEntity, LogEntity, SessionEntity])
      can(Action.Read, 'all')
    }

    return build({
      detectSubjectType: item =>
        item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}
