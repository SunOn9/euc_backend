import { Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToMany(() => MemberEntity, (member) => member.event)
  member: MemberEntity[];

  @OneToMany(
    () => PaymentSessionEntity,
    (paymentSession) => paymentSession.event,
  )
  paymentSession?: PaymentSessionEntity[];

  @OneToMany(
    () => ReceiptSessionEntity,
    (receiptSession) => receiptSession.event,
  )
  receiptSession?: ReceiptSessionEntity[];

  type: EnumEventType;

  constructor(partial: Partial<EventEntity>) {
    Object.assign(this, partial);
  }
}
