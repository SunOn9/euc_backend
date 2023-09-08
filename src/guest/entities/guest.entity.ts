import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ClubEntity } from '/club/entities/club.entity';

@Entity({ name: 'guest' })
export class GuestEntity {
  static tableName = 'guest';

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ClubEntity, (club) => club.guest)
  club: ClubEntity;
}
