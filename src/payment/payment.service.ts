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

@Injectable()
export class PaymentService {
  constructor(
    private readonly repo: PaymentRepository,
    private readonly logService: LogService,
  ) { }

  async create(
    requestData: CreatePaymentRequestDto,
    sessionId: string,
    userInfo: User,
  ) {

    const createReply = await this.repo.createPayment(requestData)

    if (createReply.isOk()) {
      await this.logService.create({
        action: Action.CREATE,
        subject: PaymentEntity.tableName,
        newData: createReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
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
    const paymentReply = await this.repo.getDetail(requestData.conditions)

    if (paymentReply.isErr()) {
      return err(paymentReply.error)
    }

    const updateReply = await this.repo.updatePayment(requestData)

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.UPDATE,
        subject: PaymentEntity.tableName,
        oldData: paymentReply.value,
        newData: updateReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
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
    }
    return removeReply
  }
}
