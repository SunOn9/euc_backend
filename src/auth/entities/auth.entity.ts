import { UserEntity } from 'src/user/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({ name: 'auth' })
export class AuthEntity {
  static tableName = 'auth'

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => UserEntity, user => user.auth)
  user: UserEntity

  @Column({ nullable: true })
  ipAddress?: string

  @Column({ nullable: true })
  authToken?: string

  @Column({ nullable: true })
  sessionId?: string

  @Column({ nullable: true })
  userAgent?: string

  @Column({ nullable: true })
  platform?: string

  @Column({ nullable: true })
  longtitude?: number

  @Column({ nullable: true })
  latitude?: number

  @CreateDateColumn()
  createdAt: Date

  constructor(partial: Partial<AuthEntity>) {
    Object.assign(this, partial)
  }
}
