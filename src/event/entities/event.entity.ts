import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
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
  @JoinTable({
    name: 'member_in_event',
    joinColumn: { name: 'event_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'member_id', referencedColumnName: 'id' },
  })
  member: MemberEntity[]

  @ManyToMany(() => GuestEntity, guest => guest.event)
  @JoinTable({
    name: 'guest_in_event',
    joinColumn: { name: 'event_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'guest_id', referencedColumnName: 'id' },
  })
  guest: GuestEntity[]

  @ManyToOne(() => PlaceEntity, place => place.event, { nullable: true })
  place?: PlaceEntity

  @ManyToOne(() => ClubEntity, club => club.event)
  club: ClubEntity

  @OneToMany(
    () => PaymentSessionEntity,
    paymentSession => paymentSession.event,
    { nullable: true },
  )
  paymentSession?: PaymentSessionEntity[]

  @OneToMany(
    () => ReceiptSessionEntity,
    receiptSession => receiptSession.event,
    { nullable: true },
  )
  receiptSession?: ReceiptSessionEntity[]

  @Column()
  startEventDate: Date

  @Column()
  endEventDate: Date

  @Column({ nullable: true })
  actualEndEventDate?: Date

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
