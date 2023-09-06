import { Entity, PrimaryGeneratedColumn } from 'typeorm';

enum TypeOfEvent {
  OTHER = 0,
  WEEKLY_TRAINING = 1,
  PLUS_TRAINING = 2,
  TOURNAMENT = 3,
}

@Entity({ name: 'event' })
export class EventEntity {
  static tableName = 'event';

  @PrimaryGeneratedColumn()
  id: number;

  name: string;

  type: TypeOfEvent;
}
