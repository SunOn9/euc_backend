import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { err } from 'neverthrow'
import { ClubRepository } from './provider/club.repository'
import { CreateClubRequestDto } from './dto/create-club.dto'
import { GetClubConditionRequestDto } from './dto/get-club-condition-request.dto'
import { RemoveClubRequestDto } from './dto/remove-club.dto'
import { UpdateClubRequestDto } from './dto/update-club.dto'
import { AreaService } from '/area/area.service'
import { LogService } from '/log/log.service'
import { Action } from '/permission/casl/casl.type'
import { ClubEntity } from './entities/club.entity'
import { User } from '/generated/user/user'

@Injectable()
export class ClubService {
  constructor(
    private readonly repo: ClubRepository,
    private readonly areaService: AreaService,
    private readonly logService: LogService,
  ) {}

  async create(
    requestData: CreateClubRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    //Check club exits
    const clubReply = await this.getDetail({
      name: requestData.name,
    })

    if (clubReply.isOk()) {
      return err(
        new Error(`Club already exits with name: [${requestData.name}]`),
      )
    }

    const areaReply = await this.areaService.getDetail({
      id: requestData.areaId,
    })

    if (areaReply.isErr()) {
      return err(areaReply.error)
    }

    const createReply = await this.repo.createClub(requestData)

    if (createReply.isOk()) {
      await this.logService.create({
        action: Action.CREATE,
        subject: ClubEntity.tableName,
        newData: createReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return createReply
  }

  async getDetail(requestData: GetClubConditionRequestDto) {
    return await this.repo.getDetail(requestData)
  }

  async getList(requestData: GetClubConditionRequestDto) {
    return await this.repo.getList(requestData)
  }

  async update(
    requestData: UpdateClubRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const clubReply = await this.repo.getDetail(requestData.conditions)

    if (clubReply.isErr()) {
      return err(clubReply.error)
    }

    const updateReply = await this.repo.updateClub(requestData)

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.UPDATE,
        subject: ClubEntity.tableName,
        oldData: clubReply.value,
        newData: updateReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return updateReply
  }

  async remove(
    requestData: RemoveClubRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    //Check club
    const clubReply = await this.getDetail({
      id: requestData.id,
    })

    if (clubReply.isErr()) {
      return err(clubReply.error)
    }

    const removeReply = await this.repo.removeClub(requestData)

    if (removeReply.isOk()) {
      await this.logService.create({
        action: Action.DELETE,
        subject: ClubEntity.tableName,
        oldData: clubReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return removeReply
  }
}
