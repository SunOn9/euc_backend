import { User } from '/generated/user/user'

export class SessionEntity {
  static tableName = 'session'
  id: string

  expireDate: Date

  userInfo: Partial<User>

  constructor(partial: Partial<SessionEntity>) {
    Object.assign(this, partial)
  }
}
