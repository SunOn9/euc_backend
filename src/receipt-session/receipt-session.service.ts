import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { err } from 'neverthrow'

import { User } from '/generated/user/user'
import { LogService } from '/log/log.service'
import { Action } from '/permission/casl/casl.type'
import { CreateReceiptSessionRequestDto } from './dto/create-receipt-session.dto'
import { GetReceiptSessionConditionRequestDto } from './dto/get-receipt-session-condition-request.dto'
import { RemoveReceiptSessionRequestDto } from './dto/remove-receipt-session.dto'
import { UpdateReceiptSessionRequestDto } from './dto/update-receipt-session.dto'
import { ReceiptSessionEntity } from './entities/receipt-session.entity'
import { ReceiptSessionRepository } from './provider/receipt-session.repository'

@Injectable()
export class ReceiptSessionService {
  constructor(
    private readonly repo: ReceiptSessionRepository,
    private readonly logService: LogService,
  ) { }

  async create(
    requestData: CreateReceiptSessionRequestDto,
    sessionId: string,
    userInfo: User,
  ) {

    const createReply = await this.repo.createReceiptSession(requestData)

    if (createReply.isOk()) {
      await this.logService.create({
        action: Action.CREATE,
        subject: ReceiptSessionEntity.tableName,
        newData: createReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return createReply
  }

  async getDetail(requestData: GetReceiptSessionConditionRequestDto) {
    const updateReply = await this.repo.getDetail(requestData)

    return updateReply
  }

  async getList(requestData: GetReceiptSessionConditionRequestDto) {
    return await this.repo.getList(requestData)
  }

  async update(
    requestData: UpdateReceiptSessionRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const receiptSessionReply = await this.repo.getDetail(requestData.conditions)

    if (receiptSessionReply.isErr()) {
      return err(receiptSessionReply.error)
    }

    const updateReply = await this.repo.updateReceiptSession(requestData)

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.UPDATE,
        subject: ReceiptSessionEntity.tableName,
        oldData: receiptSessionReply.value,
        newData: updateReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return updateReply
  }

  async remove(
    requestData: RemoveReceiptSessionRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    //Check receiptSession
    const receiptSessionReply = await this.repo.getDetail({
      id: requestData.id,
    })

    if (receiptSessionReply.isErr()) {
      return err(receiptSessionReply.error)
    }

    const removeReply = await this.repo.removeReceiptSession(requestData)

    if (removeReply.isOk()) {
      await this.logService.create({
        action: Action.DELETE,
        subject: ReceiptSessionEntity.tableName,
        oldData: receiptSessionReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }
    return removeReply
  }
}
