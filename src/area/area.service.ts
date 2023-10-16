import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { err } from 'neverthrow'
import { CreateAreaRequestDto } from './dto/create-area.dto'
import { GetAreaConditionRequestDto } from './dto/get-area-condition-request.dto'
import { RemoveAreaRequestDto } from './dto/remove-area.dto'
import { UpdateAreaRequestDto } from './dto/update-area.dto'
import { AreaRepository } from './provider/area.repository'
import { User } from '/generated/user/user'
import { LogService } from '/log/log.service'
import { Action } from '/permission/casl/casl.type'
import { AreaEntity } from './entities/area.entity'

@Injectable()
export class AreaService {
  constructor(
    private readonly repo: AreaRepository,
    private readonly logService: LogService,
  ) {}

  async create(
    requestData: CreateAreaRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    //Check area exits
    const areaReply = await this.repo.getDetail({
      name: requestData.name,
    })

    if (areaReply.isOk()) {
      return err(
        new Error(`Area already exits with name: [${requestData.name}]`),
      )
    }

    const createReply = await this.repo.createArea(requestData)

    if (createReply.isOk()) {
      await this.logService.create({
        action: Action.CREATE,
        subject: AreaEntity.tableName,
        newData: createReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return createReply
  }

  async getDetail(requestData: GetAreaConditionRequestDto) {
    const updateReply = await this.repo.getDetail(requestData)

    return updateReply
  }

  async getList(requestData: GetAreaConditionRequestDto) {
    return await this.repo.getList(requestData)
  }

  async update(
    requestData: UpdateAreaRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const areaReply = await this.repo.getDetail(requestData.conditions)

    if (areaReply.isErr()) {
      return err(areaReply.error)
    }

    const updateReply = await this.repo.updateArea(requestData)

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.UPDATE,
        subject: AreaEntity.tableName,
        oldData: areaReply.value,
        newData: updateReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return updateReply
  }

  async remove(
    requestData: RemoveAreaRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    //Check area
    const areaReply = await this.repo.getDetail({
      id: requestData.id,
    })

    if (areaReply.isErr()) {
      return err(areaReply.error)
    }

    const removeReply = await this.repo.removeArea(requestData)

    if (removeReply.isOk()) {
      await this.logService.create({
        action: Action.DELETE,
        subject: AreaEntity.tableName,
        oldData: areaReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }
    return removeReply
  }
}
