import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { err } from 'neverthrow'

import { User } from '/generated/user/user'
import { LogService } from '/log/log.service'
import { Action } from '/permission/casl/casl.type'
import { CreateReceiptRequestDto } from './dto/create-receipt.dto'
import { GetReceiptConditionRequestDto } from './dto/get-receipt-condition-request.dto'
import { RemoveReceiptRequestDto } from './dto/remove-receipt.dto'
import { UpdateReceiptRequestDto } from './dto/update-receipt.dto'
import { ReceiptEntity } from './entities/receipt.entity'
import { ReceiptRepository } from './provider/receipt.repository'

@Injectable()
export class ReceiptService {
  constructor(
    private readonly repo: ReceiptRepository,
    private readonly logService: LogService,
  ) { }

  async create(
    requestData: CreateReceiptRequestDto,
    sessionId: string,
    userInfo: User,
  ) {

    const createReply = await this.repo.createReceipt(requestData)

    if (createReply.isOk()) {
      await this.logService.create({
        action: Action.CREATE,
        subject: ReceiptEntity.tableName,
        newData: createReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return createReply
  }

  async getDetail(requestData: GetReceiptConditionRequestDto) {
    const updateReply = await this.repo.getDetail(requestData)

    return updateReply
  }

  async getList(requestData: GetReceiptConditionRequestDto) {
    return await this.repo.getList(requestData)
  }

  async update(
    requestData: UpdateReceiptRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const receiptReply = await this.repo.getDetail(requestData.conditions)

    if (receiptReply.isErr()) {
      return err(receiptReply.error)
    }

    const updateReply = await this.repo.updateReceipt(requestData)

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.UPDATE,
        subject: ReceiptEntity.tableName,
        oldData: receiptReply.value,
        newData: updateReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return updateReply
  }

  async remove(
    requestData: RemoveReceiptRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    //Check receipt
    const receiptReply = await this.repo.getDetail({
      id: requestData.id,
    })

    if (receiptReply.isErr()) {
      return err(receiptReply.error)
    }

    const removeReply = await this.repo.removeReceipt(requestData)

    if (removeReply.isOk()) {
      await this.logService.create({
        action: Action.DELETE,
        subject: ReceiptEntity.tableName,
        oldData: receiptReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }
    return removeReply
  }
}
