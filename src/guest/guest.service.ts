import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { err } from 'neverthrow'

import { User } from '/generated/user/user'
import { LogService } from '/log/log.service'
import { Action } from '/permission/casl/casl.type'
import { GuestRepository } from './provider/guest.repository'
import { CreateGuestRequestDto } from './dto/create-guest.dto'
import { GuestEntity } from './entities/guest.entity'
import { GetGuestConditionRequestDto } from './dto/get-guest-condition-request.dto'
import { UpdateGuestRequestDto } from './dto/update-guest.dto'
import { RemoveGuestRequestDto } from './dto/remove-guest.dto'
import { ClubService } from '/club/club.service'
import { EnumProto_UserRole } from '/generated/enumps'

@Injectable()
export class GuestService {
  constructor(
    private readonly repo: GuestRepository,
    private readonly logService: LogService,
    private readonly clubService: ClubService,
  ) {}

  async create(
    requestData: CreateGuestRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    if (userInfo.role !== EnumProto_UserRole.ADMIN) {
      requestData.clubId = userInfo.club.id
    }

    // Check name and nickname guest exits
    const guestReply = await this.repo.getDetail({
      name: requestData.name,
      nickName: requestData.nickName,
    })

    if (guestReply.isOk()) {
      if (requestData.nickName === undefined) {
        return err(
          new Error(`Guest already exits with name: [${requestData.name}]`),
        )
      } else {
        return err(
          new Error(
            `Guest already exits with name: [${requestData.name}] and nickname: [${requestData.nickName}]`,
          ),
        )
      }
    }

    //Check club
    const clubReply = await this.clubService.getDetail({
      id: requestData.clubId,
    })

    if (clubReply.isErr()) {
      return err(new Error(`Club with id: [${requestData.clubId}] don't exits`))
    }

    const createReply = await this.repo.createGuest(requestData)

    if (createReply.isOk()) {
      await this.logService.create({
        action: Action.CREATE,
        subject: GuestEntity.tableName,
        newData: createReply.value,
        sessionId: sessionId,
        user: userInfo,
      })

      await this.clubService.update(
        {
          conditions: {
            id: requestData.clubId,
          },
          data: {
            totalGuest: ++clubReply.value.totalGuest,
          },
        },
        sessionId,
        userInfo,
      )
    }

    return createReply
  }

  async getDetail(requestData: GetGuestConditionRequestDto) {
    const updateReply = await this.repo.getDetail(requestData)

    return updateReply
  }

  async getList(requestData: GetGuestConditionRequestDto) {
    return await this.repo.getList(requestData)
  }

  async update(
    requestData: UpdateGuestRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const guestReply = await this.repo.getDetail(requestData.conditions)

    if (guestReply.isErr()) {
      return err(guestReply.error)
    }

    const updateReply = await this.repo.updateGuest(requestData)

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.UPDATE,
        subject: GuestEntity.tableName,
        oldData: guestReply.value,
        newData: updateReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return updateReply
  }

  async remove(
    requestData: RemoveGuestRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    //Check guest
    const guestReply = await this.repo.getDetail({
      id: requestData.id,
      isExtraClub: true,
    })

    if (guestReply.isErr()) {
      return err(guestReply.error)
    }

    const removeReply = await this.repo.removeGuest(requestData)

    if (removeReply.isOk()) {
      await this.logService.create({
        action: Action.DELETE,
        subject: GuestEntity.tableName,
        oldData: guestReply.value,
        sessionId: sessionId,
        user: userInfo,
      })

      //Check club
      const clubReply = await this.clubService.getDetail({
        id: guestReply.value.club.id,
      })

      if (clubReply.isErr()) {
        return err(clubReply.error)
      }

      await this.clubService.update(
        {
          conditions: {
            id: guestReply.value.club.id,
          },
          data: {
            totalGuest: --clubReply.value.totalGuest,
          },
        },
        sessionId,
        userInfo,
      )
    }

    return removeReply
  }
}
