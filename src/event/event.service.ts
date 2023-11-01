import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { err, ok } from 'neverthrow'
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

@Injectable()
export class EventService {
  constructor(
    private readonly repo: EventRepository,
    private readonly logService: LogService,
    private readonly memberService: MemberService,
    private readonly guestService: GuestService,
  ) {}

  async create(
    requestData: CreateEventRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    //TODO: Check event type -> Create Payment Session and Reiceipt Session

    //TODO: Check place fee -> Create Payment Session

    const updateReply = await this.repo.createEvent(requestData)

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.CREATE,
        subject: EventEntity.tableName,
        newData: updateReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
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
    })

    if (eventReply.isErr()) {
      return err(eventReply.error)
    }

    const removeReply = await this.repo.removeEvent(requestData)

    if (removeReply.isOk()) {
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
    })

    if (eventReply.isErr()) {
      return err(eventReply.error)
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
    })

    if (eventReply.isErr()) {
      return err(eventReply.error)
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
    })

    if (eventReply.isErr()) {
      return err(eventReply.error)
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
    })

    if (eventReply.isErr()) {
      return err(eventReply.error)
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
    }

    return updateReply
  }

  //TODO: check status event

  //TODO: End Event -> Auto confirm ...
}
