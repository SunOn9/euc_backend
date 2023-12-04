import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ClubEntity } from '/club/entities/club.entity'
import { EventEntity } from '/event/entities/event.entity'
import { EnumProto_Gender, EnumProto_MemberType } from '/generated/enumps'

@Entity({ name: 'guest' })
export class GuestEntity {
  static tableName = 'guest'

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ nullable: true })
  nickName?: string

  @Column()
  gender: EnumProto_Gender

  @Column()
  type: EnumProto_MemberType

  @ManyToOne(() => ClubEntity, club => club.guest)
  club: ClubEntity

  @ManyToMany(() => EventEntity)
  @JoinTable({
    name: 'guest_in_event',
    joinColumn: { name: 'guest_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'event_id', referencedColumnName: 'id' },
  })
  event: EventEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date

  constructor(partial: Partial<GuestEntity>) {
    Object.assign(this, partial)
  }
}
