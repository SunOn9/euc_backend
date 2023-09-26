import { Injectable } from '@nestjs/common'
import { UserEntity } from '/user/entities/user.entity'
import { SessionInMemoryRepository } from './provider/session.in-memory-repo'
import { Result, err, ok } from 'neverthrow'

@Injectable()
export class SessionService {
  constructor(private readonly repo: SessionInMemoryRepository) {}

  async set(
    sessionId: string,
    userInfo: Partial<UserEntity>,
  ): Promise<Result<boolean, Error>> {
    const reply = await this.repo.createSession({
      id: sessionId,
      userInfo: userInfo,
    })

    if (reply.isErr()) {
      return err(reply.error)
    }

    return ok(true)
  }

  async get(sessionId: string): Promise<Result<Partial<UserEntity>, Error>> {
    const reply = await this.repo.getSession(sessionId)

    if (reply.isErr()) {
      return err(reply.error)
    }

    return ok(reply.value)
  }

  async del(sessionId: string): Promise<Result<boolean, Error>> {
    const reply = await this.repo.removeSession({ id: sessionId })

    if (reply.isErr()) {
      return err(reply.error)
    }

    return ok(true)
  }

  // async getAll(): Promise<Result<any, Error>> {
  //   return await this.repo.getAllSession()
  // }
}
