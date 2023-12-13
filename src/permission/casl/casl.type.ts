import { AreaEntity } from '/area/entities/area.entity'
import { AuthEntity } from '/auth/entities/auth.entity'
import { ClubEntity } from '/club/entities/club.entity'
import { ClubFeeEntity } from '../../clubFee/entities/clubFee.entity'
import { EventEntity } from '/event/entities/event.entity'
import { GuestEntity } from '/guest/entities/guest.entity'
import { LogEntity } from '/log/entities/log.entity'
import { MemberEntity } from '/member/entities/member.entity'
import { PaymentEntity } from '/payment/entities/payment.entity'
import { PaymentSessionEntity } from '../../paymentSession/entities/paymentSession.entity'
import { ReceiptEntity } from '/receipt/entities/receipt.entity'
import { ReceiptSessionEntity } from '../../receiptSession/entities/receiptSession.entity'
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
  'area' | 'auth' | 'club' | 'club_fee' | 'event' | 'guest' | 'member' | 'log' | 'payment' | 'payment_session' | 'receipt' | 'receipt_session' | 'place' | 'user' | 'permission'

  | 'all'
