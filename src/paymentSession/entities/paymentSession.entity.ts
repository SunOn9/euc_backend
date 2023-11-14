import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { PaymentEntity } from '/payment/entities/payment.entity'
import { EventEntity } from '/event/entities/event.entity'
import { UserEntity } from '/user/entities/user.entity'
import { EnumProto_SessionStatus } from '/generated/enumps'
import { ClubEntity } from '/club/entities/club.entity'

@Entity({ name: 'payment_session' })
export class PaymentSessionEntity {
  static tableName = 'payment_session'

  @PrimaryGeneratedColumn()
  id: number

  @OneToMany(() => PaymentEntity, payment => payment.paymentSession, {
    cascade: true,
  })
  payment: PaymentEntity[]

  @Column({ default: 0 })
  fundAmount: number

  @Column({ default: 0 })
  amount: number

  @ManyToOne(() => EventEntity, event => event.paymentSession)
  event?: EventEntity

  @Column({
    type: 'enum',
    enum: EnumProto_SessionStatus,
    enumName: 'enum_payment_session_status',
    default: EnumProto_SessionStatus.JUST_CREATE,
  })
  status: EnumProto_SessionStatus

  @Column()
  title: string

  @Column({ nullable: true })
  description?: string

  @Column({ nullable: true })
  dateConfirm?: Date

  @ManyToOne(() => UserEntity, user => user.paymentSessionConfirm, {
    nullable: true,
  })
  userConfirm?: UserEntity

  @Column({ nullable: true })
  dateDone?: Date

  @ManyToOne(() => UserEntity, user => user.paymentSessionDone, {
    nullable: true,
  })
  userDone?: UserEntity

  @ManyToOne(() => ClubEntity, club => club.paymentSession)
  club: ClubEntity

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date

  constructor(partial: Partial<PaymentSessionEntity>) {
    Object.assign(this, partial)
  }
}
