import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReceiptSessionEntity } from '/receipt-session/entities/receipt-session.entity';
import { Enum_EunumMoneyMethod } from '/generated/enum';

@Entity('receipt')
export class ReceiptEntity {
  static tableName = 'receipt';

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string | null;

  @Column()
  amount: number;

  @Column()
  method: Enum_EunumMoneyMethod;

  @ManyToOne(
    () => ReceiptSessionEntity,
    (receiptSession) => receiptSession.receipt,
  )
  receiptSession: ReceiptSessionEntity;

  constructor(partial: Partial<ReceiptEntity>) {
    Object.assign(this, partial);
  }
}
