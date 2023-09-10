import { AreaEntity } from 'src/area/entities/area.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GuestEntity } from '/guest/entities/guest.entity';
import { MemberInClubEntity } from '/member-in-club/entities/member-in-club.entity';

@Entity({ name: 'club' })
export class ClubEntity {
  static tableName = 'club';

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => MemberInClubEntity, (memberInClub) => memberInClub.club)
  memberInClub: MemberInClubEntity[];

  @OneToMany(() => GuestEntity, (guest) => guest.club)
  guest: GuestEntity[];

  @ManyToOne(() => AreaEntity, (area) => area.club)
  area: AreaEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  constructor(partial: Partial<ClubEntity>) {
    Object.assign(this, partial);
  }
}
