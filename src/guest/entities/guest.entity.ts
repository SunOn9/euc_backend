import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ClubEntity } from '/club/entities/club.entity';
import { EnumMemberType } from '/prelude/enums';

@Entity({ name: 'guest' })
export class GuestEntity {
  static tableName = 'guest';

  @PrimaryGeneratedColumn()
  id: number;

  name: string;

  @Column()
  type: EnumMemberType;

  @ManyToOne(() => ClubEntity, (club) => club.guest)
  club: ClubEntity;
}
