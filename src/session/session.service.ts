import { Injectable } from '@nestjs/common'
import { UserEntity } from '/user/entities/user.entity'
import { SessionInMemoryRepository } from './provider/session.in-memory-repo'

@Injectable()
export class SessionService {
  constructor(private readonly repo: SessionInMemoryRepository) {}

  async set(sessionId: string, userInfo: Partial<UserEntity>) {
    await this.repo.createSession({
      id: sessionId,
      userInfo: userInfo,
    })
  }
  async get() {}
  async del() {}
}
