import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { err } from 'neverthrow'
import { ClubRepository } from './provider/club.repository'
import { CreateClubRequestDto } from './dto/create-club.dto'
import { GetClubConditionRequestDto } from './dto/get-club-condition-request.dto'
import { RemoveClubRequestDto } from './dto/remove-club.dto'
import { UpdateClubRequestDto } from './dto/update-club.dto'
import { AreaService } from '/area/area.service'

@Injectable()
export class ClubService {
  constructor(
    private readonly repo: ClubRepository,
    private readonly areaService: AreaService,
  ) {}

  async create(requestData: CreateClubRequestDto) {
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

    if (requestData.fund === undefined) {
      requestData.fund = 0
    }

    return await this.repo.createClub(requestData)
  }

  async getDetail(requestData: GetClubConditionRequestDto) {
    return await this.repo.getDetail(requestData)
  }

  async getList(requestData: GetClubConditionRequestDto) {
    return await this.repo.getList(requestData)
  }

  async update(requestData: UpdateClubRequestDto) {
    return await this.repo.updateClub(requestData)
  }

  async remove(requestData: RemoveClubRequestDto) {
    //Check club
    const clubReply = await this.getDetail({
      id: requestData.id,
    })

    if (clubReply.isErr()) {
      return err(clubReply.error)
    }

    if (clubReply.value.deletedAt) {
      return err(new Error(`Club with id [${requestData.id}] is deleted`))
    }

    return await this.repo.removeClub(requestData)
  }
}
