import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { PaymentSessionEntity } from '/payment-session/entities/payment-session.entity'
import { EnumProto_MoneyMethod } from '/generated/enumps'

@Entity('payment')
export class PaymentEntity {
  static tableName = 'payment'

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ nullable: true })
  description?: string

  @Column({ default: 0 })
  amount: number

  @Column({ default: 0 })
  fundAmount: number

  @Column({ nullable: true })
  hiddenId?: number

  @Column()
  method: EnumProto_MoneyMethod

  @ManyToOne(
    () => PaymentSessionEntity,
    paymentSession => paymentSession.payment,
  )
  paymentSession: PaymentSessionEntity

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date

  constructor(partial: Partial<PaymentEntity>) {
    Object.assign(this, partial)
  }
}
