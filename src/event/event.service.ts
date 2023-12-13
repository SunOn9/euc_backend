import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Result, err, ok } from 'neverthrow'
import { EventRepository } from './provider/event.repository'
import { CreateEventRequestDto } from './dto/create-event.dto'
import { GetEventConditionRequestDto } from './dto/get-event-condition-request.dto'
import { UpdateEventRequestDto } from './dto/update-event.dto'
import { RemoveEventRequestDto } from './dto/remove-event.dto'
import { LogService } from '/log/log.service'
import { Action } from '/permission/casl/casl.type'
import { User } from '/generated/user/user'
import { EventEntity } from './entities/event.entity'
import { AddMemberToEventRequestDto } from './dto/add-member.dto'
import { AddGuestToEventRequestDto } from './dto/add-guest.dto'
import { RemoveGuestFromEventRequestDto } from './dto/remove-guest.dto'
import { RemoveMemberFromEventRequestDto } from './dto/remove-member.dto'
import { MemberService } from '/member/member.service'
import { GuestService } from '/guest/guest.service'
import { MemberEntity } from '/member/entities/member.entity'
import { GuestEntity } from '/guest/entities/guest.entity'
import {
  EnumProto_EventType,
  EnumProto_MemberType,
  EnumProto_MoneyMethod,
  EnumProto_SessionStatus,
} from '/generated/enumps'
import { PaymentSessionService } from '../paymentSession/paymentSession.service'
import { ReceiptSessionService } from '../receiptSession/receiptSession.service'
import { UtilsService } from 'lib/utils'
import { PaymentService } from '/payment/payment.service'
import { ReceiptService } from '/receipt/receipt.service'
import { ClubService } from '/club/club.service'
import { EndEventRequestDto } from './dto/end-event.dto'

@Injectable()
export class EventService {
  constructor(
    private readonly repo: EventRepository,
    private readonly logService: LogService,
    private readonly memberService: MemberService,
    private readonly guestService: GuestService,
    private readonly clubService: ClubService,
    private readonly utilsService: UtilsService,
    private readonly paymentSessionService: PaymentSessionService,
    private readonly receiptSessionService: ReceiptSessionService,
    private readonly paymentService: PaymentService,
    private readonly receiptService: ReceiptService,
  ) { }

  async create(
    requestData: CreateEventRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const reply = await this.repo.createEvent(requestData)

    if (reply.isErr()) {
      return err(reply.error)
    }

    const updateReply = await this.repo.getDetail({
      id: reply.value.id,
      isExtraPlace: true,
      isExtraClub: true,
      isExtraPaymentSession: true,
      isExtraReceiptSession: true,
      isExtraPayment: true,
      isExtraReceipt: true,
    })

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.CREATE,
        subject: EventEntity.tableName,
        newData: updateReply.value,
        sessionId: sessionId,
        user: userInfo,
      })

      if (updateReply.value.type === EnumProto_EventType.WEEKLY_TRAINING) {
        const paymentSessionReply = await this.paymentSessionService.create(
          {
            title: `Phiếu chi cho buổi tập - ${this.utilsService.convertToVietNamDate(
              updateReply.value.startEventDate,
            )}`,
            description: 'Phiếu chi tạo tự động cho buổi tập hằng tuần',
            eventId: updateReply.value.id,
          },
          sessionId,
          userInfo,
        )

        if (paymentSessionReply.isErr()) {
          return err(paymentSessionReply.error)
        }

        const receiptSessionReply = await this.receiptSessionService.create(
          {
            title: `Phiếu thu cho buổi tập - ${this.utilsService.convertToVietNamDate(
              updateReply.value.startEventDate,
            )}`,
            description: 'Phiếu thu tạo tự động cho buổi tập hằng tuần',
            eventId: updateReply.value.id,
          },
          sessionId,
          userInfo,
        )

        if (receiptSessionReply.isErr()) {
          return err(receiptSessionReply.error)
        }

        if (updateReply.value.place) {
          if (updateReply.value.place.fee !== 0) {
            await this.paymentService.create(
              {
                title: `Chi phí địa điểm buổi tập - ${updateReply.value.place.name}`,
                description: 'Chi phí tạo tự động cho địa điểm',
                method: EnumProto_MoneyMethod.UNRECOGNIZED,
                amount: updateReply.value.place.fee,
                paymentSessionId: paymentSessionReply.value.id,
              },
              sessionId,
              userInfo,
            )
          }
        }
      }
    }
    return updateReply
  }

  async getDetail(requestData: GetEventConditionRequestDto) {
    return await this.repo.getDetail(requestData)
  }

  async getList(requestData: GetEventConditionRequestDto) {
    return await this.repo.getList(requestData)
  }

  async update(
    requestData: UpdateEventRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const eventReply = await this.repo.getDetail(requestData.conditions)

    if (eventReply.isErr()) {
      return err(eventReply.error)
    }

    const updateReply = await this.repo.updateEvent(requestData)

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.UPDATE,
        subject: EventEntity.tableName,
        oldData: eventReply.value,
        newData: updateReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return updateReply
  }

  async remove(
    requestData: RemoveEventRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    //Check event
    const eventReply = await this.getDetail({
      id: requestData.id,
      isExtraPaymentSession: true,
      isExtraReceiptSession: true,
    })

    if (eventReply.isErr()) {
      return err(eventReply.error)
    }

    if (eventReply.value.actualEndEventDate) {
      return err(new Error(`Event already done`))
    }

    const removeReply = await this.repo.removeEvent(requestData)

    if (removeReply.isOk()) {
      for (const each of eventReply.value.paymentSession) {
        await this.paymentSessionService.remove(
          {
            id: each.id,
          },
          sessionId,
          userInfo,
        )
      }

      for (const each of eventReply.value.receiptSession) {
        await this.receiptSessionService.remove(
          {
            id: each.id,
          },
          sessionId,
          userInfo,
        )
      }

      const listMemberRemove = eventReply.value.member.map(each => each.id)

      await this.removeMember(
        {
          eventId: requestData.id,
          memberIdList: listMemberRemove,
        },
        sessionId,
        userInfo,
      )

      const listGuestRemove = eventReply.value.guest.map(each => each.id)

      await this.removeGuest(
        {
          eventId: requestData.id,
          guestIdList: listGuestRemove,
        },
        sessionId,
        userInfo,
      )

      await this.logService.create({
        action: Action.DELETE,
        subject: EventEntity.tableName,
        oldData: eventReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }
    return removeReply
  }

  async addMember(
    requestData: AddMemberToEventRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const eventReply = await this.getDetail({
      id: requestData.eventId,
      isExtraMember: true,
      isExtraReceiptSession: true,
    })

    if (eventReply.isErr()) {
      return err(eventReply.error)
    }


    if (eventReply.value.type === EnumProto_EventType.WEEKLY_TRAINING) {
      if (eventReply.value.receiptSession.length !== 0) {
        if (eventReply.value.receiptSession[0].status !== EnumProto_SessionStatus.JUST_CREATE) {
          return err(
            new Error(`Cannot addMember`),
          )
        }
      }
    }


    const clubReply = await this.clubService.getDetail({
      id: userInfo.club.id,
      isExtraClubFee: true,
    })

    if (clubReply.isErr()) {
      return err(clubReply.error)
    }

    const listAddMember = eventReply.value.member

    for (const memberId of requestData.memberIdList) {
      if (await this.repo.checkMemberExits(requestData.eventId, memberId)) {
        return err(
          new Error(`Member with id : [${memberId}] already exits in event`),
        )
      } else {
        listAddMember.push({
          id: memberId,
        } as MemberEntity)
      }
    }

    const updateReply = await this.repo.updateMemberInEvent(
      requestData.eventId,
      listAddMember,
    )

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.UPDATE,
        subject: EventEntity.tableName,
        oldData: eventReply.value,
        newData: updateReply,
        sessionId: sessionId,
        user: userInfo,
      })

      if (eventReply.value.type === EnumProto_EventType.WEEKLY_TRAINING) {
        if (eventReply.value.receiptSession.length !== 0) {
          for (const memberId of requestData.memberIdList) {
            const memberReply = await this.memberService.getDetail({
              id: memberId,
            })

            if (memberReply.isErr()) {
              return err(memberReply.error)
            }

            let fee: number

            switch (memberReply.value.type) {
              case EnumProto_MemberType.STUDENT: {
                fee = clubReply.value.fee[0].studentFee
                break
              }
              case EnumProto_MemberType.WORKER: {
                fee = clubReply.value.fee[0].workerFee
                break
              }
              default: {
                fee = 0
                break
              }
            }

            await this.receiptService.create(
              {
                title: `Phí buổi tập ${this.utilsService.convertToVietNamDate(
                  eventReply.value.startEventDate,
                )} - ${memberReply.value.name}`,
                description: `Tạo tự động khi thêm thành viên vào buổi tập`,
                hiddenId: memberId,
                hiddenType: 0,
                amount: fee,
                method: EnumProto_MoneyMethod.UNRECOGNIZED,
                receiptSessionId: eventReply.value.receiptSession[0].id,
              },
              sessionId,
              userInfo,
            )
          }
        }
      }
    }

    return updateReply
  }

  async removeMember(
    requestData: RemoveMemberFromEventRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const eventReply = await this.getDetail({
      id: requestData.eventId,
      isExtraMember: true,
      isExtraReceipt: true,
      isExtraReceiptSession: true,
    })

    if (eventReply.isErr()) {
      return err(eventReply.error)
    }


    if (eventReply.value.type === EnumProto_EventType.WEEKLY_TRAINING) {
      if (eventReply.value.receiptSession.length !== 0) {
        if (eventReply.value.receiptSession[0].status !== EnumProto_SessionStatus.JUST_CREATE) {
          return err(
            new Error(`Cannot removeMember`),
          )
        }
      }
    }

    for (const memberId of requestData.memberIdList) {
      if (!(await this.repo.checkMemberExits(requestData.eventId, memberId))) {
        return err(
          new Error(`Member with id : [${memberId}] isn't exits in event`),
        )
      }
    }

    const listRemoveMember = eventReply.value.member.filter(
      each => !requestData.memberIdList.includes(each.id),
    )

    const updateReply = await this.repo.updateMemberInEvent(
      requestData.eventId,
      listRemoveMember,
    )

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.UPDATE,
        subject: EventEntity.tableName,
        oldData: eventReply.value,
        newData: updateReply,
        sessionId: sessionId,
        user: userInfo,
      })

      if (eventReply.value.type === EnumProto_EventType.WEEKLY_TRAINING) {
        if (eventReply.value.receiptSession.length !== 0) {
          const { receipt } = eventReply.value.receiptSession[0]
          for (const memberId of requestData.memberIdList) {
            const reply = receipt.find(
              each => each.hiddenId === memberId && each.hiddenType === 0,
            )

            await this.receiptService.remove(
              {
                id: reply.id,
              },
              sessionId,
              userInfo,
            )
          }
        }
      }
    }

    return updateReply
  }

  async addGuest(
    requestData: AddGuestToEventRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const eventReply = await this.getDetail({
      id: requestData.eventId,
      isExtraGuest: true,
      isExtraReceiptSession: true,
      isExtraReceipt: true,
    })

    if (eventReply.isErr()) {
      return err(eventReply.error)
    }


    if (eventReply.value.type === EnumProto_EventType.WEEKLY_TRAINING) {
      if (eventReply.value.receiptSession.length !== 0) {
        if (eventReply.value.receiptSession[0].status !== EnumProto_SessionStatus.JUST_CREATE) {
          return err(
            new Error(`Cannot addGuest`),
          )
        }
      }
    }

    const clubReply = await this.clubService.getDetail({
      id: userInfo.club.id,
      isExtraClubFee: true,
    })

    if (clubReply.isErr()) {
      return err(clubReply.error)
    }

    const listAddGuest = eventReply.value.guest

    for (const guestId of requestData.guestIdList) {
      if (await this.repo.checkGuestExits(requestData.eventId, guestId)) {
        return err(
          new Error(`Guest with id : [${guestId}] already exits in event`),
        )
      } else {
        listAddGuest.push({
          id: guestId,
        } as GuestEntity)
      }
    }

    const updateReply = await this.repo.updateGuestInEvent(
      requestData.eventId,
      listAddGuest,
    )

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.UPDATE,
        subject: EventEntity.tableName,
        oldData: eventReply.value,
        newData: updateReply,
        sessionId: sessionId,
        user: userInfo,
      })

      if (eventReply.value.type === EnumProto_EventType.WEEKLY_TRAINING) {
        if (eventReply.value.receiptSession.length !== 0) {
          for (const guestId of requestData.guestIdList) {
            const guestReply = await this.guestService.getDetail({
              id: guestId,
            })

            if (guestReply.isErr()) {
              return err(guestReply.error)
            }

            let fee: number

            switch (guestReply.value.type) {
              case EnumProto_MemberType.STUDENT: {
                fee = clubReply.value.fee[0].studentFee
                break
              }
              case EnumProto_MemberType.WORKER: {
                fee = clubReply.value.fee[0].workerFee
                break
              }
              default: {
                fee = 0
                break
              }
            }

            await this.receiptService.create(
              {
                title: `Phí buổi tập ${this.utilsService.convertToVietNamDate(
                  eventReply.value.startEventDate,
                )} - ${guestReply.value.name}`,
                description: `Tạo tự động khi thêm thành viên vào buổi tập`,
                hiddenId: guestId,
                hiddenType: 1,
                amount: fee,
                method: EnumProto_MoneyMethod.UNRECOGNIZED,
                receiptSessionId: eventReply.value.receiptSession[0].id,
              },
              sessionId,
              userInfo,
            )
          }
        }
      }
    }

    return updateReply
  }

  async removeGuest(
    requestData: RemoveGuestFromEventRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const eventReply = await this.getDetail({
      id: requestData.eventId,
      isExtraGuest: true,
      isExtraReceipt: true,
      isExtraReceiptSession: true,
    })

    if (eventReply.isErr()) {
      return err(eventReply.error)
    }


    if (eventReply.value.type === EnumProto_EventType.WEEKLY_TRAINING) {
      if (eventReply.value.receiptSession.length !== 0) {
        if (eventReply.value.receiptSession[0].status !== EnumProto_SessionStatus.JUST_CREATE) {
          return err(
            new Error(`Cannot removeGuest`),
          )
        }
      }
    }

    for (const guestId of requestData.guestIdList) {
      if (!(await this.repo.checkGuestExits(requestData.eventId, guestId))) {
        return err(
          new Error(`Guest with id : [${guestId}] isn't exits in event`),
        )
      }
    }

    const listRemoveGuest = eventReply.value.guest.filter(
      each => !requestData.guestIdList.includes(each.id),
    )

    const updateReply = await this.repo.updateGuestInEvent(
      requestData.eventId,
      listRemoveGuest,
    )

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.UPDATE,
        subject: EventEntity.tableName,
        oldData: eventReply.value,
        newData: updateReply,
        sessionId: sessionId,
        user: userInfo,
      })

      if (eventReply.value.type === EnumProto_EventType.WEEKLY_TRAINING) {
        if (eventReply.value.receiptSession.length !== 0) {
          const { receipt } = eventReply.value.receiptSession[0]
          for (const guestId of requestData.guestIdList) {
            const reply = receipt.find(
              each => each.hiddenId === guestId && each.hiddenType === 1,
            )

            await this.receiptService.remove(
              {
                id: reply.id,
              },
              sessionId,
              userInfo,
            )
          }
        }
      }
    }

    return updateReply
  }

  async endEvent(
    requestData: EndEventRequestDto,
    sessionId: string,
    userInfo: User,
  ): Promise<Result<boolean, Error>> {
    const eventReply = await this.getDetail({
      id: requestData.id,
      isExtraPaymentSession: true,
      isExtraReceiptSession: true,
      isExtraReceipt: true,
      isExtraPayment: true,
    })

    if (eventReply.isErr()) {
      return err(eventReply.error)
    }

    const { paymentSession, receiptSession } = eventReply.value

    const funcPaymentSession = async (): Promise<Result<boolean, Error>> => {
      for (const each of paymentSession) {
        if (each.status !== EnumProto_SessionStatus.CONFIRMED) {
          const { payment } = each
          for (const each of payment) {
            if (each.method === EnumProto_MoneyMethod.UNRECOGNIZED) {
              return err(new Error(`Payment session ${each.title} can't confirm - check again`))
            }
          }
          await this.paymentSessionService.confirm({ id: each.id }, sessionId, userInfo)
        }
      }
      return ok(true)
    }

    const funcReceiptSession = async (): Promise<Result<boolean, Error>> => {
      for (const each of receiptSession) {
        if (each.status !== EnumProto_SessionStatus.CONFIRMED) {
          const { receipt } = each
          for (const each of receipt) {
            if (each.method === EnumProto_MoneyMethod.UNRECOGNIZED) {
              return err(new Error(`Receipt session  ${each.title} can't confirm  - check again`))
            }
          }

          await this.receiptSessionService.confirm({ id: each.id }, sessionId, userInfo)
        }
        return ok(true)
      }
    }

    const reply = await Promise.all([
      funcPaymentSession(),
      funcReceiptSession(),
    ])

    if (reply[0].isErr()) {
      return err(reply[0].error)
    }

    if (reply[1].isErr()) {
      return err(reply[1].error)
    }

    await this.update(
      {
        conditions: {
          id: requestData.id,
        },
        data: {
          actualEndEventDate: new Date(),
        },
      },
      sessionId,
      userInfo,
    )

    return ok(true)
  }
}
