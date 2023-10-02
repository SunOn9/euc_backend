import { AreaEntity } from '/area/entities/area.entity'
import { AuthEntity } from '/auth/entities/auth.entity'
import { ClubEntity } from '/club/entities/club.entity'
import { ClubFeeEntity } from '/club-fee/entities/club-fee.entity'
import { EventEntity } from '/event/entities/event.entity'
import { GuestEntity } from '/guest/entities/guest.entity'
import { LogEntity } from '/log/entities/log.entity'
import { MemberEntity } from '/member/entities/member.entity'
import { PaymentEntity } from '/payment/entities/payment.entity'
import { PaymentSessionEntity } from '/payment-session/entities/payment-session.entity'
import { ReceiptEntity } from '/receipt/entities/receipt.entity'
import { ReceiptSessionEntity } from '/receipt-session/entities/receipt-session.entity'
import { PlaceEntity } from '/place/entities/place.entity'
import { UserEntity } from '/user/entities/user.entity'
import { PermissionEntity } from '../entities/permission.entity'
import { InferSubjects } from '@casl/ability/dist/types'

export enum Action {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

export type Subject =
  | InferSubjects<
      | typeof AreaEntity
      | typeof AuthEntity
      | typeof ClubEntity
      | typeof ClubFeeEntity
      | typeof EventEntity
      | typeof GuestEntity
      | typeof LogEntity
      | typeof MemberEntity
      | typeof PaymentEntity
      | typeof PaymentSessionEntity
      | typeof ReceiptEntity
      | typeof ReceiptSessionEntity
      | typeof PlaceEntity
      | typeof UserEntity
      | typeof PermissionEntity
    >
  | 'all'
