import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { err } from 'neverthrow'
import { CreateAreaRequestDto } from './dto/create-area.dto'
import { GetAreaConditionRequestDto } from './dto/get-area-condition-request.dto'
import { RemoveAreaRequestDto } from './dto/remove-area.dto'
import { UpdateAreaRequestDto } from './dto/update-area.dto'
import { AreaRepository } from './provider/area.repository'

@Injectable()
export class AreaService {
  constructor(private readonly repo: AreaRepository) {}

  async create(requestData: CreateAreaRequestDto) {
    //Check area exits
    const areaReply = await this.getDetail({
      name: requestData.name,
    })

    if (areaReply.isOk()) {
      return err(
        new Error(`Area already exits with name: [${requestData.name}]`),
      )
    }

    return await this.repo.createArea(requestData)
  }

  async getDetail(requestData: GetAreaConditionRequestDto) {
    return await this.repo.getDetail(requestData)
  }

  async getList(requestData: GetAreaConditionRequestDto) {
    return await this.repo.getList(requestData)
  }

  async update(requestData: UpdateAreaRequestDto) {
    return await this.repo.updateArea(requestData)
  }

  async remove(requestData: RemoveAreaRequestDto) {
    //Check area
    const areaReply = await this.getDetail({
      id: requestData.id,
    })

    if (areaReply.isErr()) {
      return err(areaReply.error)
    }

    if (areaReply.value.deletedAt) {
      return err(new Error(`Area with id [${requestData.id}] is deleted`))
    }

    return await this.repo.removeArea(requestData)
  }
}
