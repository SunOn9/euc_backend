import { AreaEntity } from 'src/area/entities/area.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberEntity } from '/member/entities/member.entity';
import { GuestEntity } from '/guest/entities/guest.entity';

@Entity({ name: 'club' })
export class ClubEntity {
  static tableName = 'club';

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => MemberEntity, (member) => member.club)
  member: MemberEntity[];

  @OneToMany(() => GuestEntity, (guest) => guest.club)
  guest: GuestEntity[];

  @ManyToOne(() => AreaEntity, (area) => area.club)
  @JoinColumn({ name: 'area_id' })
  area: AreaEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  constructor(partial: Partial<ClubEntity>) {
    Object.assign(this, partial);
  }
}
