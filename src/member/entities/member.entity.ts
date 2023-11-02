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
} from 'typeorm'
import { EventEntity } from 'src/event/entities/event.entity'
import { AreaEntity } from '/area/entities/area.entity'
import {
  EnumProto_Gender,
  EnumProto_MemberStatus,
  EnumProto_MemberType,
} from '/generated/enumps'
import { MemberInClubEntity } from './member-in-club.entity'

@Entity({ name: 'member' })
export class MemberEntity {
  static tableName = 'member'

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  nickName: string

  @Column()
  gender: EnumProto_Gender

  @Column()
  birthday: Date

  @Column()
  status: EnumProto_MemberStatus

  @Column()
  type: EnumProto_MemberType

  @Column({ nullable: true })
  monthlyFee?: string

  @ManyToOne(() => AreaEntity, area => area.member)
  hometown: AreaEntity

  @OneToMany(() => MemberInClubEntity, memberInClub => memberInClub.member, {
    cascade: true,
  })
  memberInClub: MemberInClubEntity[]

  @ManyToMany(() => EventEntity)
  @JoinTable({
    name: 'member_in_event',
    joinColumn: { name: 'member_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'event_id', referencedColumnName: 'id' },
  })
  event: EventEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date

  constructor(partial: Partial<MemberEntity>) {
    Object.assign(this, partial)
  }
}
