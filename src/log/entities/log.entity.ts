import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { UserEntity } from '/user/entities/user.entity'
import { AuthEntity } from '/auth/entities/auth.entity'

@Entity({ name: 'log' })
export class LogEntity {
  static tableName = 'log'

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => UserEntity, user => user.log)
  user: UserEntity

  @ManyToOne(() => AuthEntity, auth => auth.log)
  auth: AuthEntity

  @Column()
  target: string

  @Column()
  action: string

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
