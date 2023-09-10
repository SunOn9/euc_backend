import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentEntity } from '/payment/entities/payment.entity';
import { EventEntity } from '/event/entities/event.entity';

@Entity({ name: 'payment_session' })
export class PaymentSessionEntity {
  static tableName = 'payment_session';

  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => PaymentEntity, (payment) => payment.paymentSession)
  payment: PaymentEntity[];

  @ManyToOne(() => EventEntity, (event) => event.paymentSession)
  event: EventEntity;
}
