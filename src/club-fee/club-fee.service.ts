import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { err } from 'neverthrow'
import { CreateClubFeeRequestDto } from './dto/create-club-fee.dto'
import { GetClubFeeConditionRequestDto } from './dto/get-club-fee-condition-request.dto'
import { RemoveClubFeeRequestDto } from './dto/remove-club-fee.dto'
import { ClubFeeRepository } from './provider/club-fee.repository'

@Injectable()
export class ClubFeeService {
  constructor(private readonly repo: ClubFeeRepository) {}

  async create(clubId: number, requestData: CreateClubFeeRequestDto) {
    //Check clubFee exits
    const clubFeeReply = await this.repo.getDetail({
      clubId: clubId,
    })

    if (clubFeeReply.isOk() && clubFeeReply.value) {
      await this.repo.removeClubFee(clubFeeReply.value.id)
    }

    return await this.repo.createClubFee(requestData, clubId)
  }

  async getDetail(requestData: GetClubFeeConditionRequestDto) {
    return await this.repo.getDetail(requestData)
  }

  async getList(requestData: GetClubFeeConditionRequestDto) {
    return await this.repo.getList(requestData)
  }

  async remove(requestData: RemoveClubFeeRequestDto) {
    //Check clubFee
    const clubFeeReply = await this.getDetail({
      clubId: requestData.clubId,
      isExtraClub: true,
    })

    if (clubFeeReply.isErr()) {
      return err(clubFeeReply.error)
    }

    if (clubFeeReply.value.deletedAt) {
      return err(
        new Error(`ClubFee of [${clubFeeReply.value.club.name}] is deleted`),
      )
    }

    return await this.repo.removeClubFee(clubFeeReply.value.id)
  }
}
