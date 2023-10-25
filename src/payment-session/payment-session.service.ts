import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { err } from 'neverthrow'

import { User } from '/generated/user/user'
import { LogService } from '/log/log.service'
import { Action } from '/permission/casl/casl.type'
import { CreatePaymentSessionRequestDto } from './dto/create-payment-session.dto'
import { GetPaymentSessionConditionRequestDto } from './dto/get-payment-session-condition-request.dto'
import { RemovePaymentSessionRequestDto } from './dto/remove-payment-session.dto'
import { UpdatePaymentSessionRequestDto } from './dto/update-payment-session.dto'
import { PaymentSessionEntity } from './entities/payment-session.entity'
import { PaymentSessionRepository } from './provider/payment-session.repository'

@Injectable()
export class PaymentSessionService {
  constructor(
    private readonly repo: PaymentSessionRepository,
    private readonly logService: LogService,
  ) { }

  async create(
    requestData: CreatePaymentSessionRequestDto,
    sessionId: string,
    userInfo: User,
  ) {

    const createReply = await this.repo.createPaymentSession(requestData)

    if (createReply.isOk()) {
      await this.logService.create({
        action: Action.CREATE,
        subject: PaymentSessionEntity.tableName,
        newData: createReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return createReply
  }

  async getDetail(requestData: GetPaymentSessionConditionRequestDto) {
    const updateReply = await this.repo.getDetail(requestData)

    return updateReply
  }

  async getList(requestData: GetPaymentSessionConditionRequestDto) {
    return await this.repo.getList(requestData)
  }

  async update(
    requestData: UpdatePaymentSessionRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const paymentSessionReply = await this.repo.getDetail(requestData.conditions)

    if (paymentSessionReply.isErr()) {
      return err(paymentSessionReply.error)
    }

    const updateReply = await this.repo.updatePaymentSession(requestData)

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.UPDATE,
        subject: PaymentSessionEntity.tableName,
        oldData: paymentSessionReply.value,
        newData: updateReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return updateReply
  }

  async remove(
    requestData: RemovePaymentSessionRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    //Check paymentSession
    const paymentSessionReply = await this.repo.getDetail({
      id: requestData.id,
    })

    if (paymentSessionReply.isErr()) {
      return err(paymentSessionReply.error)
    }

    const removeReply = await this.repo.removePaymentSession(requestData)

    if (removeReply.isOk()) {
      await this.logService.create({
        action: Action.DELETE,
        subject: PaymentSessionEntity.tableName,
        oldData: paymentSessionReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }
    return removeReply
  }
}
