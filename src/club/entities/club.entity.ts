import { AreaEntity } from 'src/area/entities/area.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { GuestEntity } from '/guest/entities/guest.entity'
import { ClubFeeEntity } from '/club-fee/entities/club-fee.entity'
import { UserEntity } from '/user/entities/user.entity'
import { EventEntity } from '/event/entities/event.entity'
import { MemberInClubEntity } from '/member/entities/member-in-club.entity'

@Entity({ name: 'club' })
export class ClubEntity {
  static tableName = 'club'

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ nullable: true })
  abbreviation?: string

  @Column()
  fund: number

  @Column({ default: 0 })
  totalMember: number

  @Column({ default: 0 })
  totalGuest: number

  @OneToMany(() => MemberInClubEntity, memberInClub => memberInClub.club, {
    cascade: true,
  })
  memberInClub: MemberInClubEntity[]

  @OneToMany(() => ClubFeeEntity, fee => fee.club)
  fee: ClubFeeEntity[]

  @OneToMany(() => EventEntity, event => event.club)
  event: EventEntity[]

  @OneToMany(() => GuestEntity, guest => guest.club)
  guest: GuestEntity[]

  @ManyToOne(() => AreaEntity, area => area.club, { cascade: true })
  area: AreaEntity

  @OneToMany(() => UserEntity, user => user.club)
  user: UserEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date

  constructor(partial: Partial<ClubEntity>) {
    Object.assign(this, partial)
  }
}
