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
import { ConfirmReceiptSessionRequestDto } from './dto/confirm-receipt-session.dto'
import { Club } from '/generated/club/club'
import { EnumProto_SessionStatus, EnumProto_UserRole } from '/generated/enumps'
import { Receipt } from '/generated/receipt/receipt'
import { ClubService } from '/club/club.service'
import { ReceiptService } from '/receipt/receipt.service'

@Injectable()
export class ReceiptSessionService {
  constructor(
    private readonly repo: ReceiptSessionRepository,
    private readonly logService: LogService,
    private readonly receiptService: ReceiptService,
    private readonly clubService: ClubService,
  ) { }

  async create(
    requestData: CreateReceiptSessionRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const createReply = await this.repo.createReceiptSession(requestData, userInfo.club.id)

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
    const receiptSessionReply = await this.repo.getDetail(
      requestData.conditions,
    )

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

  async confirm(
    requestData: ConfirmReceiptSessionRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const receiptSessionReply = await this.repo.getDetail(requestData)

    if (receiptSessionReply.isErr()) {
      return err(receiptSessionReply.error)
    }

    await this.repo.update(
      {
        id: requestData.id,
      },
      {
        status: EnumProto_SessionStatus.CONFIRMED,
        dateConfirm: new Date(),
        userConfirm: userInfo,
      },
    )

    const updateReply = await this.repo.getDetail(requestData)

    if (updateReply.isErr()) {
      return err(updateReply.error)
    }

    await this.logService.create({
      action: Action.UPDATE,
      subject: ReceiptSessionEntity.tableName,
      oldData: receiptSessionReply.value,
      newData: updateReply.value,
      sessionId: sessionId,
      user: userInfo,
    })

    return updateReply
  }

  async done(
    requestData: ConfirmReceiptSessionRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    if (
      userInfo.role !== EnumProto_UserRole.TREASURER &&
      userInfo.role !== EnumProto_UserRole.ADMIN
    ) {
      return err(new Error(`Forbidden Resource`))
    }

    const receiptSessionReply = await this.repo.getDetail(requestData)

    const clubReply = await this.clubService.getDetail({
      id: userInfo.club.id,
    })

    if (clubReply.isErr()) {
      return err(clubReply.error)
    }

    if (receiptSessionReply.isErr()) {
      return err(receiptSessionReply.error)
    }

    await this.repo.update(
      {
        id: requestData.id,
      },
      {
        status: EnumProto_SessionStatus.DONE,
        dateDone: new Date(),
        userDone: userInfo,
        fundAmount: clubReply.value.fund + receiptSessionReply.value.amount,
      },
    )

    const updateReply = await this.repo.getDetail({
      id: requestData.id,
      isExtraReceipt: true,
    })

    if (updateReply.isErr()) {
      return err(updateReply.error)
    }

    const { receipt, ...other } = updateReply.value

    await this.handleUpdateReceiptAmount(
      receipt,
      clubReply.value,
      userInfo,
      sessionId,
    )

    await this.logService.create({
      action: Action.UPDATE,
      subject: ReceiptSessionEntity.tableName,
      oldData: receiptSessionReply.value,
      newData: other,
      sessionId: sessionId,
      user: userInfo,
    })

    return updateReply
  }

  async handleUpdateReceiptAmount(
    listReceipt: Receipt[],
    club: Club,
    userInfo: User,
    sessionId: string,
  ) {
    let fund = club.fund

    for (const receipt of listReceipt) {
      await this.receiptService.update(
        {
          conditions: {
            id: receipt.id,
          },
          data: {
            fundAmount: fund + receipt.amount,
          },
        },
        sessionId,
        userInfo,
      )

      fund += receipt.amount
    }
  }
}
