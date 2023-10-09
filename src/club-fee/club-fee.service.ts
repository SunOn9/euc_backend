import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { err } from 'neverthrow'
import { CreateClubFeeRequestDto } from './dto/create-club-fee.dto'
import { GetClubFeeConditionRequestDto } from './dto/get-club-fee-condition-request.dto'
import { RemoveClubFeeRequestDto } from './dto/remove-club-fee.dto'
import { ClubFeeRepository } from './provider/club-fee.repository'
import { User } from '/generated/user/user'
import { EnumProto_UserRole } from '/generated/enumps'

@Injectable()
export class ClubFeeService {
  constructor(private readonly repo: ClubFeeRepository) {}

  async create(userInfo: User, requestData: CreateClubFeeRequestDto) {
    let { clubId, ...other } = requestData

    if (userInfo.role === EnumProto_UserRole.ADMIN) {
      clubId = userInfo.club.id
    }

    //Check clubFee exits
    const clubFeeReply = await this.repo.getDetail({
      clubId: clubId,
    })

    if (clubFeeReply.isOk() && clubFeeReply.value) {
      await this.repo.removeClubFee(clubFeeReply.value.id)
    }

    return await this.repo.createClubFee(other, clubId)
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
