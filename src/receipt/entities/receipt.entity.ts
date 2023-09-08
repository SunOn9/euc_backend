import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('receipt')
export class ReceiptEntity {
  static tableName = 'receipt';

  @PrimaryGeneratedColumn()
  id: number;
}
