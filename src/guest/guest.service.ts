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

@Injectable()
export class GuestService {
  constructor(
    private readonly repo: GuestRepository,
    private readonly logService: LogService,
  ) {}

  async create(
    requestData: CreateGuestRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    // // Check guest exits
    // const guestReply = await this.repo.getDetail({
    //   name: requestData.name,
    // })

    // if (guestReply.isOk()) {
    //   return err(
    //     new Error(`Guest already exits with name: [${requestData.name}]`),
    //   )
    // }

    const createReply = await this.repo.createGuest(requestData)

    if (createReply.isOk()) {
      await this.logService.create({
        action: Action.CREATE,
        subject: GuestEntity.tableName,
        newData: createReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
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
    }
    return removeReply
  }
}
