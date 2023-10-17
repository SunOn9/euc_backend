import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MemberEntity } from '/member/entities/member.entity';
import { ClubEntity } from '/club/entities/club.entity';

@Entity({ name: 'member_in_club' })
export class MemberInClubEntity {
  static tableName = 'member_in_club';

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MemberEntity, (member) => member.memberInClub)
  member: MemberEntity;

  @ManyToOne(() => ClubEntity, (club) => club.memberInClub)
  club: ClubEntity;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;

  constructor(partial: Partial<MemberInClubEntity>) {
    Object.assign(this, partial);
  }
}
