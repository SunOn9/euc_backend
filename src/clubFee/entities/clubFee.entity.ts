import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ClubEntity } from '/club/entities/club.entity'

@Entity({ name: 'club_fee' })
export class ClubFeeEntity {
  static tableName = 'club_fee'

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => ClubEntity, club => club.fee)
  club: ClubEntity

  @Column()
  studentFee: number

  @Column()
  workerFee: number

  @Column()
  monthlyFee: number

  @CreateDateColumn()
  createdAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  constructor(partial: Partial<ClubFeeEntity>) {
    Object.assign(this, partial)
  }
}
