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

    // if (clubFeeReply.isOk()) {
    //   return err(new Error(`ClubFee already exits in: [${``}]`))
    // }

    return await this.repo.createClubFee(requestData)
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
      id: requestData.id,
    })

    if (clubFeeReply.isErr()) {
      return err(clubFeeReply.error)
    }

    if (clubFeeReply.value.deletedAt) {
      return err(new Error(`ClubFee with id [${requestData.id}] is deleted`))
    }

    return await this.repo.removeClubFee(requestData)
  }
}
