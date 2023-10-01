import { BeforeApplicationShutdown, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { SessionInMemoryRepository } from './provider/session.in-memory-repo'
import { Result, err, ok } from 'neverthrow'
import { Cron, CronExpression } from '@nestjs/schedule'
import { User } from '/generated/user/user'
import { SessionEntity } from './entities/session.entity'


@Injectable()
export class SessionService implements BeforeApplicationShutdown, OnModuleInit {
  constructor(private readonly repo: SessionInMemoryRepository) { }
  private readonly logger = new Logger(SessionService.name)

  beforeApplicationShutdown() {
    const fs = require('fs');
    this.logger.debug(`Save session to JSON file`)
    const sessionsReply = this.repo.getAll()

    if (!sessionsReply) {
      fs.writeFileSync('data/sessions.json', JSON.stringify('', null, 4), 'utf8')
    }

    fs.writeFileSync('data/sessions.json', JSON.stringify(sessionsReply, null, 4), 'utf8')
  }

  onModuleInit() {
    const fs = require('fs');
    this.logger.debug(`Load session from JSON file`)

    const sessionReply = fs.readFileSync('data/sessions.json', 'utf8');

    if (!sessionReply) {
      return
    }

    const sessionList: SessionEntity[] = JSON.parse(sessionReply)

    this.repo.createListSession(sessionList)
  }

  @Cron(CronExpression.EVERY_WEEKEND)
  handleDeleteSession() {
    const data = this.repo.getAll()

    const timestamp = new Date()

    data.map(each => {
      if (each.expireDate < timestamp) {
        this.repo.removeSession({ id: each.id })
        this.logger.debug(`Deleted expired session:  ${each.id}`)
      }
    })
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
