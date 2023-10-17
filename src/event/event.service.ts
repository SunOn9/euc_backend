import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { err } from 'neverthrow'
import { EventRepository } from './provider/event.repository'
import { CreateEventRequestDto } from './dto/create-event.dto'
import { GetEventConditionRequestDto } from './dto/get-event-condition-request.dto'
import { UpdateEventRequestDto } from './dto/update-event.dto'
import { RemoveEventRequestDto } from './dto/remove-event.dto'
import { LogService } from '/log/log.service'
import { Action } from '/permission/casl/casl.type'
import { User } from '/generated/user/user'
import { EventEntity } from './entities/event.entity'

@Injectable()
export class EventService {
  constructor(
    private readonly repo: EventRepository,
    private readonly logService: LogService,
  ) {}

  async create(
    requestData: CreateEventRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    //TODO: Check event type -> Create Payment Session and Reiceipt Session

    //TODO: Check place fee -> Create Payment Session

    const updateReply = await this.repo.createEvent(requestData)

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.CREATE,
        subject: EventEntity.tableName,
        newData: updateReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return updateReply
  }

  async getDetail(requestData: GetEventConditionRequestDto) {
    return await this.repo.getDetail(requestData)
  }

  async getList(requestData: GetEventConditionRequestDto) {
    return await this.repo.getList(requestData)
  }

  async update(
    requestData: UpdateEventRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const eventReply = await this.repo.getDetail(requestData.conditions)

    if (eventReply.isErr()) {
      return err(eventReply.error)
    }

    const updateReply = await this.repo.updateEvent(requestData)

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.UPDATE,
        subject: EventEntity.tableName,
        oldData: eventReply.value,
        newData: updateReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return updateReply
  }

  async remove(
    requestData: RemoveEventRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    //Check event
    const eventReply = await this.getDetail({
      id: requestData.id,
    })

    if (eventReply.isErr()) {
      return err(eventReply.error)
    }

    const removeReply = await this.repo.removeEvent(requestData)

    if (removeReply.isOk()) {
      await this.logService.create({
        action: Action.DELETE,
        subject: EventEntity.tableName,
        oldData: eventReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }
    return removeReply
  }

  // TODO: Add member, and guest
}
