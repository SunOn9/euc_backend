import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventEntity } from 'src/event/entities/event.entity';
import { AreaEntity } from '/area/entities/area.entity';
import { EnumMemberStatus, EnumMemberType } from '/prelude/enums';
import { MemberInClubEntity } from '/member-in-club/entities/member-in-club.entity';

@Entity({ name: 'member' })
export class MemberEntity {
  static tableName = 'member';

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  birthday: Date;

  @Column()
  age: number;

  @Column()
  status: EnumMemberStatus;

  @Column()
  type: EnumMemberType;

  @ManyToOne(() => AreaEntity, (area) => area.member)
  hometown: AreaEntity;

  @OneToMany(() => MemberInClubEntity, (memberInClub) => memberInClub.member)
  memberInClub: MemberInClubEntity[];

  @ManyToMany(() => EventEntity)
  @JoinTable({
    name: 'member_in_event',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'event_id', referencedColumnName: 'id' },
  })
  event: EventEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
