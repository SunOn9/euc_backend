import { UserEntity } from '/user/entities/user.entity'
export class SessionEntity {
  static tableName = 'session'
  id: string

  userInfo: Partial<UserEntity>

  constructor(partial: Partial<SessionEntity>) {
    Object.assign(this, partial)
  }
}
