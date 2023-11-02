import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { err } from 'neverthrow'
import { CreatePaymentRequestDto } from './dto/create-payment.dto'
import { GetPaymentConditionRequestDto } from './dto/get-payment-condition-request.dto'
import { RemovePaymentRequestDto } from './dto/remove-payment.dto'
import { UpdatePaymentRequestDto } from './dto/update-payment.dto'
import { PaymentRepository } from './provider/payment.repository'
import { User } from '/generated/user/user'
import { LogService } from '/log/log.service'
import { Action } from '/permission/casl/casl.type'
import { PaymentEntity } from './entities/payment.entity'
import { PaymentSessionService } from '/payment-session/payment-session.service'

@Injectable()
export class PaymentService {
  constructor(
    private readonly repo: PaymentRepository,
    private readonly logService: LogService,
    private readonly paymentSessionService: PaymentSessionService,
  ) {}

  async create(
    requestData: CreatePaymentRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const paymentSessionReply = await this.paymentSessionService.getDetail({
      id: requestData.paymentSessionId,
    })

    if (paymentSessionReply.isErr()) {
      return err(paymentSessionReply.error)
    }

    const createReply = await this.repo.createPayment(requestData)

    if (createReply.isOk()) {
      //log
      await this.logService.create({
        action: Action.CREATE,
        subject: PaymentEntity.tableName,
        newData: createReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
      //update paymentSession amount
      await this.paymentSessionService.update(
        {
          conditions: {
            id: requestData.paymentSessionId,
          },
          data: {
            amount: paymentSessionReply.value.amount + createReply.value.amount,
          },
        },
        sessionId,
        userInfo,
      )
    }

    return createReply
  }

  async getDetail(requestData: GetPaymentConditionRequestDto) {
    const updateReply = await this.repo.getDetail(requestData)

    return updateReply
  }

  async getList(requestData: GetPaymentConditionRequestDto) {
    return await this.repo.getList(requestData)
  }

  async update(
    requestData: UpdatePaymentRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const paymentReply = await this.repo.getDetail({
      ...requestData.conditions,
      isExtraPaymentSession: true,
    })

    if (paymentReply.isErr()) {
      return err(paymentReply.error)
    }

    const updateReply = await this.repo.updatePayment(requestData)

    if (updateReply.isOk()) {
      //log
      await this.logService.create({
        action: Action.UPDATE,
        subject: PaymentEntity.tableName,
        oldData: paymentReply.value,
        newData: updateReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
      //update paymentSession -> minus old amount and add new amount
      if (requestData.data.amount !== undefined) {
        await this.paymentSessionService.update(
          {
            conditions: { id: paymentReply.value.paymentSession.id },
            data: {
              amount:
                paymentReply.value.paymentSession.amount -
                paymentReply.value.amount +
                updateReply.value.amount,
            },
          },
          sessionId,
          userInfo,
        )
      }
    }

    return updateReply
  }

  async remove(
    requestData: RemovePaymentRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    //Check payment
    const paymentReply = await this.repo.getDetail({
      id: requestData.id,
      isExtraPaymentSession: true,
    })

    if (paymentReply.isErr()) {
      return err(paymentReply.error)
    }

    const removeReply = await this.repo.removePayment(requestData)

    if (removeReply.isOk()) {
      await this.logService.create({
        action: Action.DELETE,
        subject: PaymentEntity.tableName,
        oldData: paymentReply.value,
        sessionId: sessionId,
        user: userInfo,
      })

      //update paymentSession amount
      await this.paymentSessionService.update(
        {
          conditions: {
            id: paymentReply.value.paymentSession.id,
          },
          data: {
            amount:
              paymentReply.value.paymentSession.amount -
              paymentReply.value.amount,
          },
        },
        sessionId,
        userInfo,
      )
    }
    return removeReply
  }
}
