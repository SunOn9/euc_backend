import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { err } from 'neverthrow'
import { CreateClubFeeRequestDto } from './dto/create-clubFee.dto'
import { GetClubFeeConditionRequestDto } from './dto/get-clubFee-condition-request.dto'
import { RemoveClubFeeRequestDto } from './dto/remove-clubFee.dto'
import { ClubFeeRepository } from './provider/clubFee.repository'
import { User } from '/generated/user/user'
import { EnumProto_UserRole } from '/generated/enumps'
import { LogService } from '/log/log.service'
import { Action } from '/permission/casl/casl.type'
import { ClubFeeEntity } from './entities/clubFee.entity'

@Injectable()
export class ClubFeeService {
  constructor(
    private readonly repo: ClubFeeRepository,
    private readonly logService: LogService,
  ) {}

  async create(
    requestData: CreateClubFeeRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    let { clubId, ...other } = requestData

    if (userInfo.role !== EnumProto_UserRole.ADMIN) {
      clubId = userInfo.club.id
    }

    //Check clubFee exits
    const clubFeeReply = await this.repo.getDetail({
      clubId: clubId,
    })

    if (clubFeeReply.isOk() && clubFeeReply.value) {
      await this.repo.removeClubFee(clubFeeReply.value.id)
    }

    const createReply = await this.repo.createClubFee(other, clubId)

    if (createReply.isOk()) {
      await this.logService.create({
        action: Action.CREATE,
        subject: ClubFeeEntity.tableName,
        newData: createReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return createReply
  }

  async getDetail(requestData: GetClubFeeConditionRequestDto) {
    return await this.repo.getDetail(requestData)
  }

  async getList(requestData: GetClubFeeConditionRequestDto) {
    return await this.repo.getList(requestData)
  }

  async remove(
    requestData: RemoveClubFeeRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    //Check clubFee
    const clubFeeReply = await this.getDetail({
      clubId: requestData.clubId,
      isExtraClub: true,
    })

    if (clubFeeReply.isErr()) {
      return err(clubFeeReply.error)
    }

    const removeReply = await this.repo.removeClubFee(clubFeeReply.value.id)

    if (removeReply.isOk()) {
      await this.logService.create({
        action: Action.DELETE,
        subject: ClubFeeEntity.tableName,
        oldData: clubFeeReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return removeReply
  }
}
