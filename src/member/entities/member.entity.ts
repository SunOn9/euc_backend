import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventEntity } from 'src/event/entities/event.entity';
import { AreaEntity } from '/area/entities/area.entity';
import { EnumMemberStatus, EnumMemberType } from '/prelude/enums';
import { MemberInClubEntity } from '/member-in-club/entities/member-in-club.entity';
import { MemberFeeEntity } from '/member-fee/entities/member-fee.entity';

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

  @OneToOne(() => MemberFeeEntity, (fee) => fee.member)
  fee: MemberFeeEntity;

  @ManyToOne(() => AreaEntity, (area) => area.member)
  hometown: AreaEntity;

  @ManyToMany(() => MemberInClubEntity, (memberInClub) => memberInClub.member)
  memberInClub: MemberInClubEntity[];

  @ManyToMany(() => EventEntity)
  @JoinTable({
    name: 'user_in_event',
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
