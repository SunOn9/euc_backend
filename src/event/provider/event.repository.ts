import { UtilsService } from 'lib/utils'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Result, err, ok } from 'neverthrow'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { EventEntity } from '../entities/event.entity'
import { EventReflect } from './event.proto'
import { CreateEventRequestDto } from '../dto/create-event.dto'
import { Event } from '/generated/event/event'
import { UpdateEventRequestDto } from '../dto/update-event.dto'
import { GetEventConditionRequestDto } from '../dto/get-event-condition-request.dto'
import { EventListDataReply } from '/generated/event/event.reply'
import { RemoveEventRequestDto } from '../dto/remove-event.dto'
import { Member } from '/generated/member/member'
import { Guest } from '/generated/guest/guest'

@Injectable()
export class EventRepository extends Repository<EventEntity> {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private cache: Cache,
    private dataSource: DataSource,
    private proto: EventReflect,
    private utilService: UtilsService,
  ) {
    super(EventEntity, dataSource.createEntityManager())
  }

  async createEvent(
    createData: CreateEventRequestDto,
  ): Promise<Result<Event, Error>> {
    try {
      const { clubId, placeId, ...other } = createData

      const saveData = {
        ...other,
        place: placeId !== undefined ? { id: placeId } : {},
        club: { id: clubId },
      } as EventEntity

      const dataReply = await this.save(saveData)

      if (this.utilService.isObjectEmpty(dataReply)) {
        return err(new Error(`Cannot create event in database`))
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async updateMemberInEvent(
    eventId: number,
    listMember: Partial<Member>[],
  ): Promise<Result<Event, Error>> {
    try {
      const dataReply = await this.save({
        id: eventId,
        member: listMember,
      })

      if (this.utilService.isObjectEmpty(dataReply)) {
        return err(new Error(`Cannot update member in event in database`))
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async updateGuestInEvent(
    eventId: number,
    listGuest: Partial<Guest>[],
  ): Promise<Result<Event, Error>> {
    try {
      const dataReply = await this.save({
        id: eventId,
        guest: listGuest,
      })

      if (this.utilService.isObjectEmpty(dataReply)) {
        return err(new Error(`Cannot update guest in event in database`))
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async updateEvent(
    updateData: UpdateEventRequestDto,
  ): Promise<Result<Event, Error>> {
    try {
      if (this.utilService.isObjectEmpty(updateData.conditions)) {
        return err(new Error(`Empty conditions`))
      }

      await this.update(updateData.conditions, updateData.data)

      return await this.getDetail(updateData.conditions)
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async checkMemberExits(eventId: number, memberId: number): Promise<boolean> {
    return await this.exist({
      where: {
        id: eventId,
        member: {
          id: memberId,
        },
      },
    })
  }

  async checkGuestExits(eventId: number, guestId: number): Promise<boolean> {
    return await this.exist({
      where: {
        id: eventId,
        guest: {
          id: guestId,
        },
      },
    })
  }

  async getDetail(
    conditions: GetEventConditionRequestDto,
  ): Promise<Result<Event, Error>> {
    try {
      if (this.utilService.isObjectEmpty(conditions)) {
        return err(new Error(`Empty conditions`))
      }

      const queryBuilder = this.setupQueryCondition(conditions)

      const dataReply = await queryBuilder.orderBy(`id`, 'DESC').getOne()

      if (!dataReply) {
        return err(
          new Error(`Cannot get event with conditions: [${conditions}]`),
        )
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getList(
    conditions: GetEventConditionRequestDto,
  ): Promise<Result<EventListDataReply, Error>> {
    try {
      // if (!conditions) {
      //   return err(new Error(`Empty conditions`));
      // }

      const page = conditions.page ?? 1
      const limit = conditions.limit ?? 20
      const skip: number = limit * page - limit

      const queryBuilder = this.setupQueryCondition(conditions)

      const [dataReply, total] = await queryBuilder
        .orderBy(`id`, 'DESC')
        .take(limit)
        .skip(skip)
        .getManyAndCount()

      if (!dataReply) {
        return err(
          new Error(`Cannot get list event with conditions: [${conditions}]`),
        )
      }

      const eventList: Event[] = dataReply.map(each => {
        return this.proto.reflect(each)
      })

      return ok({
        total,
        page,
        limit,
        eventList,
      })
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async removeEvent(
    removeData: RemoveEventRequestDto,
  ): Promise<Result<boolean, Error>> {
    const dataReply = await this.softDelete(removeData)

    if (this.utilService.isObjectEmpty(dataReply)) {
      return err(new Error(`Error when remove event`))
    }

    return ok(true)
  }

  setupQueryCondition(
    conditions: GetEventConditionRequestDto,
  ): SelectQueryBuilder<EventEntity> {
    const queryBuilder = this.createQueryBuilder(EventEntity.tableName)

    if (conditions.id !== undefined) {
      queryBuilder.andWhere(`id = :id`, {
        id: `${conditions.id}`,
      })
    }

    if (conditions.name !== undefined) {
      queryBuilder.andWhere(`name LIKE :name`, {
        name: `%${conditions.name}%`,
      })
    }

    if (conditions.type !== undefined) {
      queryBuilder.andWhere(`type = :type`, {
        type: `${conditions.type}`,
      })
    }

    if (
      conditions.startEventDateSearchStart !== undefined &&
      conditions.startEventDateSearchEnd !== undefined
    ) {
      queryBuilder.andWhere(
        `start_event_date BETWEEN (:startEventDateSearchStart, :startEventDateSearchEnd)`,
        {
          startEventDateSearchStart: `${conditions.startEventDateSearchStart}`,
          startEventDateSearchEnd: `${conditions.startEventDateSearchEnd}`,
        },
      )
    }

    if (
      conditions.endEventDateSearchStart !== undefined &&
      conditions.endEventDateSearchEnd !== undefined
    ) {
      queryBuilder.andWhere(
        `end_event_date BETWEEN (:endEventDateSearchStart, :endEventDateSearchEnd)`,
        {
          endEventDateSearchStart: `${conditions.endEventDateSearchStart}`,
          endEventDateSearchEnd: `${conditions.endEventDateSearchEnd}`,
        },
      )
    }

    if (conditions.isDeleted) {
      queryBuilder.withDeleted()
    }

    queryBuilder.setFindOptions({
      relationLoadStrategy: 'query',
      relations: {
        club: conditions.isExtraClub ?? false,
        member: conditions.isExtraMember ?? false,
        guest: conditions.isExtraGuest ?? false,
        place: conditions.isExtraPlace ?? false,
        paymentSession: conditions.isExtraPaymentSession
          ? {
              payment: conditions.isExtraPayment ?? false,
            }
          : false,
        receiptSession: conditions.isExtraReceiptSession
          ? {
              receipt: conditions.isExtraReceipt ?? false,
            }
          : false,
      },
    })

    return queryBuilder
  }
}
