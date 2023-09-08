import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

  title: string;

  description: string;

  event?: EventEntity | null;

  @OneToMany(() => ReceiptEntity, (receipt) => receipt.receiptSession)
  receipt: ReceiptEntity[];

  status: EnumReceiptSessionStatus;

  dateConfirm?: Date | null;

  userConfirm?: UserEntity | null;

  dateDone?: Date | null;

  userDone?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;
}
