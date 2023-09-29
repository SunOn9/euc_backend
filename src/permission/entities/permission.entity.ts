import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { UserEntity } from '/user/entities/user.entity'
import { RawRule } from '../casl/rules'
@Entity({ name: 'permission' })
export class PermissionEntity {
  static tableName = 'permission'

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(() => UserEntity, user => user.permission)
  user: UserEntity[]

  @Column('json')
  rules: RawRule

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date

  constructor(partial: Partial<PermissionEntity>) {
    Object.assign(this, partial)
  }
}
