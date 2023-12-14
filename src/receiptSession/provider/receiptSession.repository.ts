import { UtilsService } from 'lib/utils'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Result, err, ok } from 'neverthrow'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { CreateReceiptSessionRequestDto } from '../dto/create-receiptSession.dto'
import { ReceiptSessionEntity } from '../entities/receiptSession.entity'
import { ReceiptSessionReflect } from './receiptSession.proto'
import { ReceiptSession } from '/generated/receiptSession/receiptSession'
import { ReceiptSessionListDataReply } from '/generated/receiptSession/receiptSession.reply'
import { GetReceiptSessionConditionRequestDto } from '../dto/get-receiptSession-condition-request.dto'
import { RemoveReceiptSessionRequestDto } from '../dto/remove-receiptSession.dto'
import { UpdateReceiptSessionRequestDto } from '../dto/update-receiptSession.dto'

@Injectable()
export class ReceiptSessionRepository extends Repository<ReceiptSessionEntity> {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private cache: Cache,
    private dataSource: DataSource,
    private proto: ReceiptSessionReflect,
    private utilService: UtilsService,
  ) {
    super(ReceiptSessionEntity, dataSource.createEntityManager())
  }

  async createReceiptSession(
    createData: CreateReceiptSessionRequestDto,
    clubId: number,
  ): Promise<Result<ReceiptSession, Error>> {
    try {
      const { eventId, ...other } = createData

      const saveData = {
        ...other,
        event: eventId !== undefined ? { id: eventId } : {},
        club: { id: clubId },
      } as ReceiptSessionEntity

      const dataReply = await this.save(saveData)

      if (this.utilService.isObjectEmpty(dataReply)) {
        return err(new Error(`Cannot create receiptSession in database`))
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async updateReceiptSession(
    updateData: UpdateReceiptSessionRequestDto,
  ): Promise<Result<ReceiptSession, Error>> {
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

  async getDetail(
    conditions: GetReceiptSessionConditionRequestDto,
  ): Promise<Result<ReceiptSession, Error>> {
    try {
      if (this.utilService.isObjectEmpty(conditions)) {
        return err(new Error(`Empty conditions`))
      }

      const queryBuilder = this.setupQueryCondition(conditions)

      const dataReply = await queryBuilder.orderBy(`id`, 'DESC').getOne()

      if (!dataReply) {
        return err(
          new Error(
            `Cannot get receiptSession with conditions: [${conditions}]`,
          ),
        )
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getList(
    conditions: GetReceiptSessionConditionRequestDto,
  ): Promise<Result<ReceiptSessionListDataReply, Error>> {
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
          new Error(
            `Cannot get list receiptSession with conditions: [${conditions}]`,
          ),
        )
      }

      const receiptSessionList: ReceiptSession[] = dataReply.map(each => {
        return this.proto.reflect(each)
      })

      return ok({
        total,
        page,
        limit,
        receiptSessionList,
      })
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async removeReceiptSession(
    removeData: RemoveReceiptSessionRequestDto,
  ): Promise<Result<boolean, Error>> {
    const dataReply = await this.softDelete(removeData)

    if (this.utilService.isObjectEmpty(dataReply)) {
      return err(new Error(`Error when removereceiptSession`))
    }

    return ok(true)
  }

  setupQueryCondition(
    conditions: GetReceiptSessionConditionRequestDto,
  ): SelectQueryBuilder<ReceiptSessionEntity> {
    const queryBuilder = this.createQueryBuilder(ReceiptSessionEntity.tableName)

    if (conditions.id !== undefined) {
      queryBuilder.andWhere(`id = :id`, {
        id: `${conditions.id}`,
      })
    }

    if (conditions.clubId !== undefined) {
      queryBuilder.andWhere(`club_id = :clubId`, {
        clubId: `${conditions.clubId}`,
      })
    }

    if (conditions.title !== undefined) {
      queryBuilder.andWhere(`title LIKE :title`, {
        title: `%${conditions.title}%`,
      })
    }

    if (conditions.description !== undefined) {
      queryBuilder.andWhere(`description LIKE :description`, {
        description: `%${conditions.description}%`,
      })
    }

    if (conditions.status !== undefined) {
      queryBuilder.andWhere(`status = :status`, {
        status: `${conditions.status}`,
      })
    }

    if (
      conditions.fromDateConfirm !== undefined &&
      conditions.toDateConfirm !== undefined
    ) {
      queryBuilder.andWhere(
        `date_confirm BETWEEN :fromDateConfirm AND :toDateConfirm`,
        {
          fromDateConfirm: `${conditions.fromDateConfirm}`,
          toDateConfirm: `${conditions.toDateConfirm}`,
        },
      )
    }

    if (
      conditions.fromDateDone !== undefined &&
      conditions.toDateDone !== undefined
    ) {
      queryBuilder.andWhere(`date_done BETWEEN :fromDateDone AND :toDateDone`, {
        fromDateDone: `${conditions.fromDateDone}`,
        toDateDone: `${conditions.toDateDone}`,
      })
    }

    if (conditions.isDeleted) {
      queryBuilder.withDeleted()
    }

    queryBuilder.setFindOptions({
      relationLoadStrategy: 'query',
      relations: {
        userDone: conditions.isExtraUserDone ?? false,
        userConfirm: conditions.isExtraUserConfirm ?? false,
        event: conditions.isExtraEvent ?? false,
        receipt: conditions.isExtraReceipt ?? false,
        club: conditions.isExtraClub ?? false,
      },
    })

    return queryBuilder
  }
}
