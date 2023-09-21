import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventEntity } from 'src/event/entities/event.entity';
import { AreaEntity } from '/area/entities/area.entity';
import { MemberInClubEntity } from '/member-in-club/entities/member-in-club.entity';
import { Enum_EnumMemberStatus, Enum_EnumMemberType } from '/generated/enum';

@Entity({ name: 'member' })
export class MemberEntity {
  static tableName = 'member';

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  nickName: string;

  @Column()
  birthday: Date;

  @Column()
  status: Enum_EnumMemberStatus;

  @Column()
  type: Enum_EnumMemberType;

  @Column({ nullable: true })
  monthlyFee?: string | null;

  @ManyToOne(() => AreaEntity, (area) => area.member)
  hometown: AreaEntity;

  @OneToMany(() => MemberInClubEntity, (memberInClub) => memberInClub.member)
  memberInClub: MemberInClubEntity[];

  @ManyToMany(() => EventEntity)
  @JoinTable({
    name: 'member_in_event',
    joinColumn: { name: 'member_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'event_id', referencedColumnName: 'id' },
  })
  event: EventEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  constructor(partial: Partial<MemberEntity>) {
    Object.assign(this, partial);
  }
}
