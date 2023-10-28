import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReceiptSessionEntity } from '/receipt-session/entities/receipt-session.entity';
import { EnumProto_MoneyMethod } from '/generated/enumps';

@Entity('receipt')
export class ReceiptEntity {
  static tableName = 'receipt';

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  fundAmount: number

  @Column({ nullable: true })
  description?: string | null;

  @Column()
  amount: number;

  @Column()
  method: EnumProto_MoneyMethod;

  @ManyToOne(
    () => ReceiptSessionEntity,
    (receiptSession) => receiptSession.receipt,
  )
  receiptSession: ReceiptSessionEntity;

  //TODO: add club


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  constructor(partial: Partial<ReceiptEntity>) {
    Object.assign(this, partial);
  }
}
