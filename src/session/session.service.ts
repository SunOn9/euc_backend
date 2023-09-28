import { Injectable, Logger } from '@nestjs/common'
import { SessionInMemoryRepository } from './provider/session.in-memory-repo'
import { Result, err, ok } from 'neverthrow'
import { Cron, CronExpression } from '@nestjs/schedule'
import { User } from '/generated/user/user'

@Injectable()
export class SessionService {
  constructor(private readonly repo: SessionInMemoryRepository) {}
  private readonly logger = new Logger(SessionService.name)

  @Cron(CronExpression.EVERY_WEEKEND)
  handleDeleteSession() {
    this.logger.debug(`=== Start delete expired session ===`)

    const data = this.repo.getAll()

    const timestamp = new Date()

    data.map(each => {
      if (each.expireDate < timestamp) {
        this.repo.removeSession({ id: each.id })
        this.logger.debug(`Deleted expired session:  ${each.id}`)
      }
    })

    this.logger.debug(`=== End delete expired session ===`)
  }

  async set(
    sessionId: string,
    expireDate: Date,
    userInfo: Partial<User>,
  ): Promise<Result<boolean, Error>> {
    const reply = await this.repo.createSession({
      id: sessionId,
      expireDate: expireDate,
      userInfo: userInfo,
    })

    if (reply.isErr()) {
      return err(reply.error)
    }

    return ok(true)
  }

  async get(sessionId: string): Promise<Result<Partial<User>, Error>> {
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
