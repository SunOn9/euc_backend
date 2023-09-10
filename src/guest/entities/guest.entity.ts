import { Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ClubEntity } from '/club/entities/club.entity';
import { MemberFeeEntity } from '/member-fee/entities/member-fee.entity';

@Entity({ name: 'guest' })
export class GuestEntity {
  static tableName = 'guest';

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => MemberFeeEntity, (fee) => fee.guest)
  fee: MemberFeeEntity;

  @ManyToOne(() => ClubEntity, (club) => club.guest)
  club: ClubEntity;
}
