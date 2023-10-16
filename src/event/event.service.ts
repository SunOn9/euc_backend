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

    const createReply = await this.repo.createEvent(requestData)

    if (createReply.isOk()) {
      await this.logService.create({
        action: Action.CREATE,
        subject: EventEntity.tableName,
        sessionId: sessionId,
        newData: createReply.value,
        user: userInfo,
      })
    }

    return createReply
  }

  async getDetail(requestData: GetEventConditionRequestDto) {
    return await this.repo.getDetail(requestData)
  }

  async getList(requestData: GetEventConditionRequestDto) {
    return await this.repo.getList(requestData)
  }

  async update(requestData: UpdateEventRequestDto) {
    return await this.repo.updateEvent(requestData)
  }

  async remove(requestData: RemoveEventRequestDto) {
    //Check event
    const eventReply = await this.getDetail({
      id: requestData.id,
    })

    if (eventReply.isErr()) {
      return err(eventReply.error)
    }

    if (eventReply.value.deletedAt) {
      return err(new Error(`Event with id [${requestData.id}] is deleted`))
    }

    return await this.repo.removeEvent(requestData)
  }
}
