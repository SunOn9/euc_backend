import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { err } from 'neverthrow'

import { User } from '/generated/user/user'
import { LogService } from '/log/log.service'
import { Action } from '/permission/casl/casl.type'
import { CreatePaymentSessionRequestDto } from './dto/create-paymentSession.dto'
import { GetPaymentSessionConditionRequestDto } from './dto/get-paymentSession-condition-request.dto'
import { RemovePaymentSessionRequestDto } from './dto/remove-paymentSession.dto'
import { UpdatePaymentSessionRequestDto } from './dto/update-paymentSession.dto'
import { PaymentSessionEntity } from './entities/paymentSession.entity'
import { PaymentSessionRepository } from './provider/paymentSession.repository'
import { ClubService } from '/club/club.service'
import { ConfirmPaymentSessionRequestDto } from './dto/confirm-paymentSession.dto'
import {
  EnumProto_MoneyMethod,
  EnumProto_SessionStatus,
  EnumProto_UserRole,
} from '/generated/enumps'
import { Club } from '/generated/club/club'
import { PaymentService } from '/payment/payment.service'
import { Payment } from '/generated/payment/payment'
import { Inject, forwardRef } from '@nestjs/common'
import { ForbiddenError } from '@casl/ability'

@Injectable()
export class PaymentSessionService {
  constructor(
    private readonly repo: PaymentSessionRepository,
    private readonly logService: LogService,
    private readonly clubService: ClubService,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
  ) { }

  async create(
    requestData: CreatePaymentSessionRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const createReply = await this.repo.createPaymentSession(
      requestData,
      userInfo.club.id,
    )

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

  async getDetail(requestData: GetPaymentSessionConditionRequestDto, userInfo: User) {
    if (userInfo.role !== EnumProto_UserRole.ADMIN && userInfo.role !== EnumProto_UserRole.STAFF) {
      requestData.clubId = userInfo.club.id
    }

    return await this.repo.getDetail(requestData)
  }

  async getList(requestData: GetPaymentSessionConditionRequestDto, userInfo: User) {
    if (userInfo.role !== EnumProto_UserRole.ADMIN && userInfo.role !== EnumProto_UserRole.STAFF) {
      requestData.clubId = userInfo.club.id
    }

    return await this.repo.getList(requestData)
  }

  async update(
    requestData: UpdatePaymentSessionRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const paymentSessionReply = await this.repo.getDetail(
      requestData.conditions,
    )

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
      isExtraClub: true,
      isExtraEvent: true,
    })

    if (paymentSessionReply.isErr()) {
      return err(paymentSessionReply.error)
    }

    if (
      paymentSessionReply.value.event &&
      !paymentSessionReply.value.event.actualEndEventDate
    ) {
      return err(new Error(`Event still happen`))
    }

    const updateReply = await this.repo.updatePaymentSession({
      conditions: {
        id: requestData.id,
      },
      data: {
        status: EnumProto_SessionStatus.CANCEL,
      },
    })

    if (updateReply.isErr()) {
      return err(updateReply.error)
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

      //update fund when status is done
      if (paymentSessionReply.value.status === EnumProto_SessionStatus.DONE) {
        await this.clubService.update(
          {
            conditions: {
              id: userInfo.club.id,
            },
            data: {
              fund:
                paymentSessionReply.value.club.fund +
                paymentSessionReply.value.amount,
            },
          },
          sessionId,
          userInfo,
        )
      }
    }
    return removeReply
  }

  async confirm(
    requestData: ConfirmPaymentSessionRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const paymentSessionReply = await this.repo.getDetail({
      ...requestData,
      isExtraPayment: true,
    })

    if (paymentSessionReply.isErr()) {
      return err(paymentSessionReply.error)
    }

    for (const each of paymentSessionReply.value.payment) {
      if (each.method === EnumProto_MoneyMethod.UNRECOGNIZED) {
        return err(
          new Error(
            `Payment ${each.id} - ${each.title} still haven't choose method`,
          ),
        )
      }
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
      subject: PaymentSessionEntity.tableName,
      oldData: paymentSessionReply.value,
      newData: updateReply.value,
      sessionId: sessionId,
      user: userInfo,
    })

    return updateReply
  }

  async done(
    requestData: ConfirmPaymentSessionRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    if (
      userInfo.role !== EnumProto_UserRole.TREASURER &&
      userInfo.role !== EnumProto_UserRole.ADMIN
    ) {
      return err(new Error(`Forbiden`))
    }

    const paymentSessionReply = await this.repo.getDetail({
      ...requestData,
      isExtraPayment: true,
    })

    if (paymentSessionReply.isErr()) {
      return err(paymentSessionReply.error)
    }

    for (const each of paymentSessionReply.value.payment) {
      if (each.method === EnumProto_MoneyMethod.UNRECOGNIZED) {
        return err(
          new Error(
            `Payment ${each.id} - ${each.title} still haven't choose method`,
          ),
        )
      }
    }

    const clubReply = await this.clubService.getDetail({
      id: userInfo.club.id,
    })

    if (clubReply.isErr()) {
      return err(clubReply.error)
    }

    await this.repo.update(
      {
        id: requestData.id,
      },
      {
        status: EnumProto_SessionStatus.DONE,
        dateDone: new Date(),
        userDone: userInfo,
        fundAmount: clubReply.value.fund - paymentSessionReply.value.amount,
      },
    )

    const updateClub = await this.clubService.update(
      {
        conditions: { id: clubReply.value.id },
        data: {
          fund: clubReply.value.fund - paymentSessionReply.value.amount,
        },
      },
      sessionId,
      userInfo,
    )

    if (updateClub.isErr()) {
      return err(updateClub.error)
    }

    const updateReply = await this.repo.getDetail({
      id: requestData.id,
      isExtraPayment: true,
    })

    if (updateReply.isErr()) {
      return err(updateReply.error)
    }

    const { payment, ...other } = updateReply.value

    await this.handleUpdatePaymentAmount(
      payment,
      clubReply.value,
      userInfo,
      sessionId,
    )

    await this.logService.create({
      action: Action.UPDATE,
      subject: PaymentSessionEntity.tableName,
      oldData: paymentSessionReply.value,
      newData: other,
      sessionId: sessionId,
      user: userInfo,
    })

    return updateReply
  }

  async handleUpdatePaymentAmount(
    listPayment: Payment[],
    club: Club,
    userInfo: User,
    sessionId: string,
  ) {
    let fund = club.fund

    for (const payment of listPayment) {
      await this.paymentService.update(
        {
          conditions: {
            id: payment.id,
          },
          data: {
            fundAmount: fund - payment.amount,
          },
        },
        sessionId,
        userInfo,
      )

      fund -= payment.amount
    }
  }
}
