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
import { ReceiptEntity } from '/receipt/entities/receipt.entity';
import { EnumReceiptSessionStatus } from '/prelude/enums';
import { UserEntity } from '/user/entities/user.entity';
import { EventEntity } from '/event/entities/event.entity';

@Entity({ name: 'receipt_session' })
export class ReceiptSessionEntity {
  public static tableName = 'receipt_session';

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string | null;

  @ManyToOne(() => EventEntity, (event) => event.receiptSession, {
    nullable: true,
  })
  event?: EventEntity | null;

  @OneToMany(() => ReceiptEntity, (receipt) => receipt.receiptSession)
  receipt: ReceiptEntity[];

  @Column({
    type: 'enum',
    enum: EnumReceiptSessionStatus,
    enumName: 'enum_receipt_session_status',
    default: EnumReceiptSessionStatus.JUST_CREATE,
  })
  status: EnumReceiptSessionStatus;

  @Column({ nullable: true })
  dateConfirm?: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.receiptSessionConfirm, {
    nullable: true,
  })
  userConfirm?: UserEntity | null;

  @Column({ nullable: true })
  dateDone?: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.receiptSessionDone, {
    nullable: true,
  })
  userDone?: UserEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;
}
