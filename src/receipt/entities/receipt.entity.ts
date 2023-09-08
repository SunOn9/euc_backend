import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReceiptSessionEntity } from '/receipt-session/entities/receipt-session.entity';
import { EunumReceiptMethod } from '/prelude/enums';

@Entity('receipt')
export class ReceiptEntity {
  static tableName = 'receipt';

  @PrimaryGeneratedColumn()
  id: number;

  title: string;

  description?: string | null;

  amount: number;

  method: EunumReceiptMethod;

  @ManyToOne(
    () => ReceiptSessionEntity,
    (receiptSession) => receiptSession.receipt,
  )
  receiptSession?: ReceiptSessionEntity | null;
}
