import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { err } from 'neverthrow'
import { CreatePlaceRequestDto } from './dto/create-place.dto'
import { GetPlaceConditionRequestDto } from './dto/get-place-condition-request.dto'
import { RemovePlaceRequestDto } from './dto/remove-place.dto'
import { UpdatePlaceRequestDto } from './dto/update-place.dto'
import { PlaceRepository } from './provider/place.repository'
import { User } from '/generated/user/user'
import { LogService } from '/log/log.service'
import { Action } from '/permission/casl/casl.type'
import { PlaceEntity } from './entities/place.entity'

@Injectable()
export class PlaceService {
  constructor(
    private readonly repo: PlaceRepository,
    private readonly logService: LogService,
  ) { }

  async create(
    requestData: CreatePlaceRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    //Check place exits
    const placeReply = await this.repo.getDetail({
      name: requestData.name,
    })

    if (placeReply.isOk()) {
      return err(
        new Error(`Place already exits with name: [${requestData.name}]`),
      )
    }

    const createReply = await this.repo.createPlace(requestData)

    if (createReply.isOk()) {
      await this.logService.create({
        action: Action.CREATE,
        subject: PlaceEntity.tableName,
        newData: createReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return createReply
  }

  async getDetail(requestData: GetPlaceConditionRequestDto) {
    const updateReply = await this.repo.getDetail(requestData)

    return updateReply
  }

  async getList(requestData: GetPlaceConditionRequestDto) {
    return await this.repo.getList(requestData)
  }

  async update(
    requestData: UpdatePlaceRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const placeReply = await this.repo.getDetail(requestData.conditions)

    if (placeReply.isErr()) {
      return err(placeReply.error)
    }

    const updateReply = await this.repo.updatePlace(requestData)

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.UPDATE,
        subject: PlaceEntity.tableName,
        oldData: placeReply.value,
        newData: updateReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return updateReply
  }

  async remove(
    requestData: RemovePlaceRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    //Check place
    const placeReply = await this.repo.getDetail({
      id: requestData.id,
    })

    if (placeReply.isErr()) {
      return err(placeReply.error)
    }

    const removeReply = await this.repo.removePlace(requestData)

    if (removeReply.isOk()) {
      await this.logService.create({
        action: Action.DELETE,
        subject: PlaceEntity.tableName,
        oldData: placeReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }
    return removeReply
  }
}
