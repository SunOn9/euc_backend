import { UtilsService } from 'lib/utils'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Result, err, ok } from 'neverthrow'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { CreatePaymentRequestDto } from '../dto/create-payment.dto'
import { GetPaymentConditionRequestDto } from '../dto/get-payment-condition-request.dto'
import { RemovePaymentRequestDto } from '../dto/remove-payment.dto'
import { UpdatePaymentRequestDto } from '../dto/update-payment.dto'
import { PaymentEntity } from '../entities/payment.entity'
import { PaymentReflect } from './payment.proto'
import { Payment } from '/generated/payment/payment'
import { PaymentListDataReply } from '/generated/payment/payment.reply'


@Injectable()
export class PaymentRepository extends Repository<PaymentEntity> {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private cache: Cache,
    private dataSource: DataSource,
    private proto: PaymentReflect,
    private utilService: UtilsService,
  ) {
    super(PaymentEntity, dataSource.createEntityManager())
  }

  async createPayment(
    createData: CreatePaymentRequestDto,
  ): Promise<Result<Payment, Error>> {
    try {
      const { paymentSessionId, ...other } = createData

      const saveData = {
        ...other,
        paymentSession: { id: paymentSessionId }
      } as PaymentEntity

      const dataReply = await this.save(saveData)

      if (this.utilService.isObjectEmpty(dataReply)) {
        return err(new Error(`Cannot create payment in database`))
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async updatePayment(
    updateData: UpdatePaymentRequestDto,
  ): Promise<Result<Payment, Error>> {
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
    conditions: GetPaymentConditionRequestDto,
  ): Promise<Result<Payment, Error>> {
    try {
      if (this.utilService.isObjectEmpty(conditions)) {
        return err(new Error(`Empty conditions`))
      }

      const queryBuilder = this.setupQueryCondition(conditions)

      const dataReply = await queryBuilder.orderBy(`id`, 'DESC').getOne()

      if (!dataReply) {
        return err(
          new Error(`Cannot get payment with conditions: [${conditions}]`),
        )
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getList(
    conditions: GetPaymentConditionRequestDto,
  ): Promise<Result<PaymentListDataReply, Error>> {
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
          new Error(`Cannot get list payment with conditions: [${conditions}]`),
        )
      }

      const paymentList: Payment[] = dataReply.map(each => {
        return this.proto.reflect(each)
      })

      return ok({
        total,
        page,
        limit,
        paymentList,
      })
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async removePayment(
    removeData: RemovePaymentRequestDto,
  ): Promise<Result<boolean, Error>> {
    const dataReply = await this.softDelete(removeData)

    if (this.utilService.isObjectEmpty(dataReply)) {
      return err(new Error(`Error when remove payment`))
    }

    return ok(true)
  }

  setupQueryCondition(
    conditions: GetPaymentConditionRequestDto,
  ): SelectQueryBuilder<PaymentEntity> {
    const queryBuilder = this.createQueryBuilder(PaymentEntity.tableName)

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

    if (conditions.amount !== undefined) {
      queryBuilder.andWhere(`amount = :amount`, {
        amount: `${conditions.amount}`,
      })
    }

    if (conditions.method !== undefined) {
      queryBuilder.andWhere(`method = :method`, {
        method: `${conditions.method}`,
      })
    }

    if (conditions.isDeleted) {
      queryBuilder.withDeleted()
    }

    queryBuilder.setFindOptions({
      relationLoadStrategy: 'query',
      relations: {
        paymentSession: conditions.isExtraPaymentSession ?? false
      },
    })

    return queryBuilder
  }
}
