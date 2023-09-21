import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberEntity } from '/member/entities/member.entity';
import { PaymentSessionEntity } from '/payment-session/entities/payment-session.entity';
import { ReceiptSessionEntity } from '/receipt-session/entities/receipt-session.entity';
import { Enum_EnumEventType } from '/generated/enum';
import { GuestEntity } from '/guest/entities/guest.entity';
import { PlaceEntity } from '/place/entities/place.entity';

@Entity({ name: 'event' })
export class EventEntity {
  static tableName = 'event';

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => MemberEntity, (member) => member.event)
  member: MemberEntity[];

  @ManyToMany(() => GuestEntity, (guest) => guest.event)
  guest: GuestEntity[];

  @ManyToOne(() => PlaceEntity, (place) => place.event)
  place?: PlaceEntity | null;

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
  type: Enum_EnumEventType;

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
