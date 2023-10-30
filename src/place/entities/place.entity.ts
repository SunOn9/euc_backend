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
import { EventEntity } from '/event/entities/event.entity'
import { ClubEntity } from '/club/entities/club.entity'

@Entity({ name: 'place' })
export class PlaceEntity {
  static tableName = 'place'

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  address: string

  @Column({ nullable: true })
  fee?: number | null

  @OneToMany(() => EventEntity, event => event.place)
  event: EventEntity[]

  @ManyToOne(() => ClubEntity, club => club.place)
  club: ClubEntity

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date

  constructor(partial: Partial<PlaceEntity>) {
    Object.assign(this, partial)
  }
}
