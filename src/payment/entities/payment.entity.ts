import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentSessionEntity } from '/payment-session/entities/payment-session.entity';

@Entity('payment')
export class PaymentEntity {
  static tableName = 'payment';

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => PaymentSessionEntity,
    (paymentSession) => paymentSession.payment,
  )
  paymentSession: PaymentSessionEntity;
}
