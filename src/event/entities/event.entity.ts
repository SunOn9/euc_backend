import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EnumEventType } from '/prelude/enums';
import { MemberEntity } from '/member/entities/member.entity';
import { PaymentSessionEntity } from '/payment-session/entities/payment-session.entity';
import { ReceiptSessionEntity } from '/receipt-session/entities/receipt-session.entity';

@Entity({ name: 'event' })
export class EventEntity {
  static tableName = 'event';

  @PrimaryGeneratedColumn()
  id: number;

  name: string;

  member: MemberEntity;

  paymentSession?: PaymentSessionEntity | null;

  receiptSession?: ReceiptSessionEntity | null;

  type: EnumEventType;

  constructor(partial: Partial<EventEntity>) {
    Object.assign(this, partial);
  }
}
