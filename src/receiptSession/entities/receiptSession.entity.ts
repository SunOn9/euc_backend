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
import { ReceiptEntity } from '/receipt/entities/receipt.entity'
import { UserEntity } from '/user/entities/user.entity'
import { EventEntity } from '/event/entities/event.entity'
import { EnumProto_SessionStatus } from '/generated/enumps'
import { ClubEntity } from '/club/entities/club.entity'

@Entity({ name: 'receipt_session' })
export class ReceiptSessionEntity {
  public static tableName = 'receipt_session'

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ default: 0 })
  fundAmount: number

  @Column({ default: 0 })
  amount: number

  @Column({ nullable: true })
  description?: string

  @ManyToOne(() => EventEntity, event => event.receiptSession, {
    nullable: true,
  })
  event?: EventEntity

  @OneToMany(() => ReceiptEntity, receipt => receipt.receiptSession, {
    cascade: true,
  })
  receipt: ReceiptEntity[]

  @Column({
    type: 'enum',
    enum: EnumProto_SessionStatus,
    enumName: 'enum_receipt_session_status',
    default: EnumProto_SessionStatus.JUST_CREATE,
  })
  status: EnumProto_SessionStatus

  @Column({ nullable: true })
  dateConfirm?: Date

  @ManyToOne(() => UserEntity, user => user.receiptSessionConfirm, {
    nullable: true,
  })
  userConfirm?: UserEntity

  @Column({ nullable: true })
  dateDone?: Date

  @ManyToOne(() => UserEntity, user => user.receiptSessionDone, {
    nullable: true,
  })
  userDone?: UserEntity

  @ManyToOne(() => ClubEntity, club => club.receiptSession)
  club: ClubEntity

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date

  constructor(partial: Partial<ReceiptSessionEntity>) {
    Object.assign(this, partial)
  }
}
