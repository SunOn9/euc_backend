import { Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from '/user/entities/user.entity'
@Entity({ name: 'permission' })
export class PermissionEntity {
  static tableName = 'permission'

  @PrimaryGeneratedColumn()
  id: number

  @ManyToMany(() => UserEntity, user => user.permission)
  user: UserEntity[]

  action: string[]

  subject?: string[]

  fields?: string[]

  conditions?: any

  inverted?: boolean

  reason?: string

  constructor(partial: Partial<PermissionEntity>) {
    Object.assign(this, partial)
  }
}
