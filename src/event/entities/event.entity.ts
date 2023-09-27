import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { MemberEntity } from '/member/entities/member.entity'
import { PaymentSessionEntity } from '/payment-session/entities/payment-session.entity'
import { ReceiptSessionEntity } from '/receipt-session/entities/receipt-session.entity'
import { GuestEntity } from '/guest/entities/guest.entity'
import { PlaceEntity } from '/place/entities/place.entity'
import { EnumProto_EventType } from '/generated/enumps'
import { ClubEntity } from '/club/entities/club.entity'

@Entity({ name: 'event' })
export class EventEntity {
  static tableName = 'event'

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(() => MemberEntity, member => member.event)
  member: MemberEntity[]

  @ManyToMany(() => GuestEntity, guest => guest.event)
  guest: GuestEntity[]

  @ManyToOne(() => PlaceEntity, place => place.event)
  place?: PlaceEntity | null

  @ManyToOne(() => ClubEntity, club => club.event)
  club: ClubEntity

  @OneToMany(() => PaymentSessionEntity, paymentSession => paymentSession.event)
  paymentSession?: PaymentSessionEntity[]

  @OneToMany(() => ReceiptSessionEntity, receiptSession => receiptSession.event)
  receiptSession?: ReceiptSessionEntity[]

  @Column()
  startEventDate: Date

  @Column()
  endEventDate: Date

  @Column()
  type: EnumProto_EventType

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  constructor(partial: Partial<EventEntity>) {
    Object.assign(this, partial)
  }
}
