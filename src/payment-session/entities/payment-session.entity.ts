import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentEntity } from '/payment/entities/payment.entity';
import { EventEntity } from '/event/entities/event.entity';
import { UserEntity } from '/user/entities/user.entity';
import { Enum_EnumSessionStatus } from '/generated/enum';

@Entity({ name: 'payment_session' })
export class PaymentSessionEntity {
  static tableName = 'payment_session';

  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => PaymentEntity, (payment) => payment.paymentSession)
  payment: PaymentEntity[];

  @ManyToOne(() => EventEntity, (event) => event.paymentSession)
  event?: EventEntity | null;

  @Column({
    type: 'enum',
    enum: Enum_EnumSessionStatus,
    enumName: 'enum_payment_session_status',
    default: Enum_EnumSessionStatus.JUST_CREATE,
  })
  status: Enum_EnumSessionStatus;

  @Column({ nullable: true })
  dateConfirm?: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.paymentSessionConfirm, {
    nullable: true,
  })
  userConfirm?: UserEntity | null;

  @Column({ nullable: true })
  dateDone?: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.paymentSessionDone, {
    nullable: true,
  })
  userDone?: UserEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;

  constructor(partial: Partial<PaymentSessionEntity>) {
    Object.assign(this, partial);
  }
}
