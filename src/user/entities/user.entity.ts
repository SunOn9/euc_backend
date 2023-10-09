import { AuthEntity } from 'src/auth/entities/auth.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { PermissionEntity } from '/permission/entities/permission.entity'
import { ReceiptSessionEntity } from '/receipt-session/entities/receipt-session.entity'
import { ClubEntity } from '/club/entities/club.entity'
import { LogEntity } from '/log/entities/log.entity'
import { PaymentSessionEntity } from '/payment-session/entities/payment-session.entity'
import { EnumProto_UserRole } from '/generated/enumps'

@Entity({ name: 'user' })
export class UserEntity {
  static tableName = 'user'

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column({ length: 60 })
  password: string

  @Column({ unique: true, nullable: true, length: 10 })
  phone?: string | null

  @Column()
  role: EnumProto_UserRole

  @ManyToMany(() => PermissionEntity, { cascade: true })
  @JoinTable({
    name: 'user_with_permission',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permission: PermissionEntity[]

  @OneToMany(() => LogEntity, log => log.user)
  log: LogEntity[]

  @ManyToOne(() => ClubEntity, club => club.user)
  club: ClubEntity

  @OneToMany(
    () => ReceiptSessionEntity,
    receiptSession => receiptSession.userConfirm,
  )
  receiptSessionConfirm: ReceiptSessionEntity[]

  @OneToMany(
    () => ReceiptSessionEntity,
    receiptSession => receiptSession.userDone,
  )
  receiptSessionDone: ReceiptSessionEntity[]

  @OneToMany(
    () => PaymentSessionEntity,
    paymentSession => paymentSession.userConfirm,
  )
  paymentSessionConfirm: PaymentSessionEntity[]

  @OneToMany(
    () => PaymentSessionEntity,
    paymentSession => paymentSession.userDone,
  )
  paymentSessionDone: PaymentSessionEntity[]

  @OneToMany(() => AuthEntity, auth => auth.user)
  auth: AuthEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date | null

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
  }
}
