import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentSessionEntity } from '/payment-session/entities/payment-session.entity';
import { Enum_EunumMoneyMethod } from '/generated/enum';

@Entity('payment')
export class PaymentEntity {
  static tableName = 'payment';

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
    () => PaymentSessionEntity,
    (paymentSession) => paymentSession.payment,
  )
  paymentSession: PaymentSessionEntity;

  constructor(partial: Partial<PaymentEntity>) {
    Object.assign(this, partial);
  }
}
