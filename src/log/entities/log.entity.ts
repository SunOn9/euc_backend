import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { UserEntity } from '/user/entities/user.entity'
import { Action, Subject } from '/permission/casl/casl.type'

@Entity({ name: 'log' })
export class LogEntity {
  static tableName = 'log'

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => UserEntity, user => user.log)
  user: UserEntity

  @Column()
  sessionId: string

  @Column('json')
  subject: Subject

  @Column()
  action: Action

  @Column('json', { nullable: true })
  oldData?: JSON

  @Column('json', { nullable: true })
  newData?: JSON

  @CreateDateColumn()
  createdAt: Date

  constructor(partial: Partial<LogEntity>) {
    Object.assign(this, partial)
  }
}
