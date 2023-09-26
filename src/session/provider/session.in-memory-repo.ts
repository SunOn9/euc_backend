import { UtilsService } from 'lib/utils'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Result, err, ok } from 'neverthrow'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { InMemoryDBService } from '@nestjs-addons/in-memory-db/src/services/in-memory-db.service'
import { SessionEntity } from '../entities/session.entity'
import { UserEntity } from '/user/entities/user.entity'

interface SessionInMemory extends SessionEntity {}

@Injectable()
export class SessionInMemoryRepository extends InMemoryDBService<SessionInMemory> {
  constructor(private ultilService: UtilsService) {
    super({ featureName: 'session' })
  }

  async createSession(
    createData: SessionEntity,
  ): Promise<Result<boolean, Error>> {
    try {
      const data = this.create(createData)

      if (this.ultilService.isObjectEmpty(data)) {
        return err(new Error(`Cannot create session in memory`))
      }

      return ok(true)
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async createListSession(
    createData: SessionEntity[],
  ): Promise<Result<boolean, Error>> {
    try {
      createData.map(each => {
        const data = this.create(each)

        if (this.ultilService.isObjectEmpty(data)) {
          return err(new Error(`Cannot create session in memory`))
        }
      })

      return ok(true)
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async removeSession(
    removeData: Partial<SessionEntity>,
  ): Promise<Result<boolean, Error>> {
    try {
      const sessionReply = this.get(removeData.id)

      if (this.ultilService.isObjectEmpty(sessionReply)) {
        return err(
          new Error(`Cannot get session with id: [${sessionReply.id}]`),
        )
      }

      this.delete(removeData.id)

      return ok(true)
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getSession(
    sessionId: string,
  ): Promise<Result<Partial<UserEntity>, Error>> {
    const reply = this.get(sessionId)

    if (!reply) {
      return err(new Error(`Unvalid session id`))
    }

    return ok(reply.userInfo)
  }

  async getAllSession(): Promise<Result<any, Error>> {
    const reply = this.getAll()
    return ok(reply)
  }
}
