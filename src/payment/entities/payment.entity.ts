import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payment')
export class PaymentEntity {
  static tableName = 'payment';

  @PrimaryGeneratedColumn()
  id: number;
}
