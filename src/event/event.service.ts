import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { err } from 'neverthrow'
import { EventRepository } from './provider/event.repository'
import { CreateEventRequestDto } from './dto/create-event.dto'
import { GetEventConditionRequestDto } from './dto/get-event-condition-request.dto'
import { UpdateEventRequestDto } from './dto/update-event.dto'
import { RemoveEventRequestDto } from './dto/remove-event.dto'

@Injectable()
export class EventService {
  constructor(private readonly repo: EventRepository) {}

  async create(requestData: CreateEventRequestDto) {
    //Check area exits
    const areaReply = await this.getDetail({
      name: requestData.name,
    })

    if (areaReply.isOk()) {
      return err(
        new Error(`Event already exits with name: [${requestData.name}]`),
      )
    }

    return await this.repo.createEvent(requestData)
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
    //Check area
    const areaReply = await this.getDetail({
      id: requestData.id,
    })

    if (areaReply.isErr()) {
      return err(areaReply.error)
    }

    if (areaReply.value.deletedAt) {
      return err(new Error(`Event with id [${requestData.id}] is deleted`))
    }

    return await this.repo.removeEvent(requestData)
  }
}
