import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ReceiptSessionEntity } from '../../receiptSession/entities/receiptSession.entity'
import { EnumProto_MoneyMethod } from '/generated/enumps'

@Entity('receipt')
export class ReceiptEntity {
  static tableName = 'receipt'

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ default: 0 })
  fundAmount: number

  @Column({ nullable: true })
  hiddenId?: number

  @Column({ nullable: true })
  hiddenType?: number

  @Column({ nullable: true })
  description?: string

  @Column({ default: 0 })
  amount: number

  @Column()
  method: EnumProto_MoneyMethod

  @ManyToOne(
    () => ReceiptSessionEntity,
    receiptSession => receiptSession.receipt,
  )
  receiptSession: ReceiptSessionEntity

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date

  constructor(partial: Partial<ReceiptEntity>) {
    Object.assign(this, partial)
  }
}
