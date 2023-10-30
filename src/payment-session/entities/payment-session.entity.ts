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

  @OneToMany(() => PaymentEntity, payment => payment.paymentSession)
  payment: PaymentEntity[]

  @Column()
  fundAmount: number

  @Column()
  amount: number

  @ManyToOne(() => EventEntity, event => event.paymentSession)
  event?: EventEntity | null

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
  description?: string | null

  @Column({ nullable: true })
  dateConfirm?: Date | null

  @ManyToOne(() => UserEntity, user => user.paymentSessionConfirm, {
    nullable: true,
  })
  userConfirm?: UserEntity | null

  @Column({ nullable: true })
  dateDone?: Date | null

  @ManyToOne(() => UserEntity, user => user.paymentSessionDone, {
    nullable: true,
  })
  userDone?: UserEntity | null

  @ManyToOne(() => ClubEntity, club => club.paymentSession)
  club: ClubEntity

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null

  constructor(partial: Partial<PaymentSessionEntity>) {
    Object.assign(this, partial)
  }
}
