import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EnumEventType } from '/prelude/enums';
import { MemberEntity } from '/member/entities/member.entity';
import { PaymentSessionEntity } from '/payment-session/entities/payment-session.entity';
import { ReceiptSessionEntity } from '/receipt-session/entities/receipt-session.entity';

@Entity({ name: 'event' })
export class EventEntity {
  static tableName = 'event';

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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

  @Column()
  startEventDate: Date;

  @Column()
  endEventDate: Date;

  @Column()
  type: EnumEventType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial: Partial<EventEntity>) {
    Object.assign(this, partial);
  }
}
