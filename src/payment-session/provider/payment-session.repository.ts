import { UtilsService } from 'lib/utils'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Result, err, ok } from 'neverthrow'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'

import { CreatePaymentSessionRequestDto } from '../dto/create-payment-session.dto'
import { GetPaymentSessionConditionRequestDto } from '../dto/get-payment-session-condition-request.dto'
import { RemovePaymentSessionRequestDto } from '../dto/remove-payment-session.dto'
import { UpdatePaymentSessionRequestDto } from '../dto/update-payment-session.dto'
import { PaymentSessionEntity } from '../entities/payment-session.entity'
import { PaymentSession } from '/generated/payment-session/payment-session'
import { PaymentSessionListDataReply } from '/generated/payment-session/payment-session.reply'
import { PaymentSessionReflect } from './payment-session.proto'

@Injectable()
export class PaymentSessionRepository extends Repository<PaymentSessionEntity> {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private cache: Cache,
    private dataSource: DataSource,
    private proto: PaymentSessionReflect,
    private utilService: UtilsService,
  ) {
    super(PaymentSessionEntity, dataSource.createEntityManager())
  }

  async createPaymentSession(
    createData: CreatePaymentSessionRequestDto,
    clubId: number
  ): Promise<Result<PaymentSession, Error>> {
    try {
      const { eventId, ...other } = createData

      const saveData = {
        ...other,
        event: eventId !== undefined ? { id: eventId } : {},
        club: { id: clubId }
      } as PaymentSessionEntity

      const dataReply = await this.save(saveData)

      if (this.utilService.isObjectEmpty(dataReply)) {
        return err(new Error(`Cannot create paymentSession in database`))
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async updatePaymentSession(
    updateData: UpdatePaymentSessionRequestDto,
  ): Promise<Result<PaymentSession, Error>> {
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
    conditions: GetPaymentSessionConditionRequestDto,
  ): Promise<Result<PaymentSession, Error>> {
    try {
      if (this.utilService.isObjectEmpty(conditions)) {
        return err(new Error(`Empty conditions`))
      }

      const queryBuilder = this.setupQueryCondition(conditions)

      const dataReply = await queryBuilder.orderBy(`id`, 'DESC').getOne()

      if (!dataReply) {
        return err(
          new Error(
            `Cannot getpaymentSession with conditions: [${conditions}]`,
          ),
        )
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getList(
    conditions: GetPaymentSessionConditionRequestDto,
  ): Promise<Result<PaymentSessionListDataReply, Error>> {
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
            `Cannot get listpaymentSession with conditions: [${conditions}]`,
          ),
        )
      }

      const paymentSessionList: PaymentSession[] = dataReply.map(each => {
        return this.proto.reflect(each)
      })

      return ok({
        total,
        page,
        limit,
        paymentSessionList,
      })
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async removePaymentSession(
    removeData: RemovePaymentSessionRequestDto,
  ): Promise<Result<boolean, Error>> {
    const dataReply = await this.softDelete(removeData)

    if (this.utilService.isObjectEmpty(dataReply)) {
      return err(new Error(`Error when removepaymentSession`))
    }

    return ok(true)
  }

  setupQueryCondition(
    conditions: GetPaymentSessionConditionRequestDto,
  ): SelectQueryBuilder<PaymentSessionEntity> {
    const queryBuilder = this.createQueryBuilder(PaymentSessionEntity.tableName)

    if (conditions.id !== undefined) {
      queryBuilder.andWhere(`id = :id`, {
        id: `${conditions.id}`,
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
        `date_confirm BETWEEN (:fromDateConfirm, :toDateConfirm)`,
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
      queryBuilder.andWhere(`date_done BETWEEN (:fromDateDone, :toDateDone)`, {
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
        payment: conditions.isExtraPayment ?? false,
      },
    })

    return queryBuilder
  }
}
