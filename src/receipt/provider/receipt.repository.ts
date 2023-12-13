import { UtilsService } from 'lib/utils'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Result, err, ok } from 'neverthrow'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { CreateReceiptRequestDto } from '../dto/create-receipt.dto'
import { GetReceiptConditionRequestDto } from '../dto/get-receipt-condition-request.dto'
import { RemoveReceiptRequestDto } from '../dto/remove-receipt.dto'
import { UpdateReceiptRequestDto } from '../dto/update-receipt.dto'
import { ReceiptEntity } from '../entities/receipt.entity'
import { ReceiptReflect } from './receipt.proto'
import { Receipt } from '/generated/receipt/receipt'
import { ReceiptListDataReply } from '/generated/receipt/receipt.reply'

@Injectable()
export class ReceiptRepository extends Repository<ReceiptEntity> {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private cache: Cache,
    private dataSource: DataSource,
    private proto: ReceiptReflect,
    private utilService: UtilsService,
  ) {
    super(ReceiptEntity, dataSource.createEntityManager())
  }

  async createReceipt(
    createData: CreateReceiptRequestDto,
  ): Promise<Result<Receipt, Error>> {
    try {
      const { receiptSessionId, ...other } = createData

      const saveData = {
        ...other,
        receiptSession: { id: receiptSessionId }
      } as ReceiptEntity

      const dataReply = await this.save(saveData)

      if (this.utilService.isObjectEmpty(dataReply)) {
        return err(new Error(`Cannot create receipt in database`))
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async updateReceipt(
    updateData: UpdateReceiptRequestDto,
  ): Promise<Result<Receipt, Error>> {
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
    conditions: GetReceiptConditionRequestDto,
  ): Promise<Result<Receipt, Error>> {
    try {
      if (this.utilService.isObjectEmpty(conditions)) {
        return err(new Error(`Empty conditions`))
      }

      const queryBuilder = this.setupQueryCondition(conditions)

      const dataReply = await queryBuilder.orderBy(`id`, 'DESC').getOne()

      if (!dataReply) {
        return err(
          new Error(`Cannot get receipt with conditions: [${conditions}]`),
        )
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getList(
    conditions: GetReceiptConditionRequestDto,
  ): Promise<Result<ReceiptListDataReply, Error>> {
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
          new Error(`Cannot get list receipt with conditions: [${conditions}]`),
        )
      }

      const receiptList: Receipt[] = dataReply.map(each => {
        return this.proto.reflect(each)
      })

      return ok({
        total,
        page,
        limit,
        receiptList,
      })
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async removeReceipt(
    removeData: RemoveReceiptRequestDto,
  ): Promise<Result<boolean, Error>> {
    const dataReply = await this.softDelete(removeData)

    if (this.utilService.isObjectEmpty(dataReply)) {
      return err(new Error(`Error when remove receipt`))
    }

    return ok(true)
  }

  setupQueryCondition(
    conditions: GetReceiptConditionRequestDto,
  ): SelectQueryBuilder<ReceiptEntity> {
    const queryBuilder = this.createQueryBuilder(ReceiptEntity.tableName)

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

    if (conditions.fromDate !== undefined && conditions.toDate !== undefined) {
      queryBuilder.andWhere(`created_at BETWEEN :fromDate AND :toDate`, {
        fromDate: `${conditions.fromDate}`,
        toDate: `${conditions.toDate}`,
      })
    }


    if (conditions.isDeleted) {
      queryBuilder.withDeleted()
    }


    queryBuilder.setFindOptions({
      relationLoadStrategy: 'query',
      relations: {
        receiptSession: conditions.isExtraReceiptSession ?? false
      },
    })

    return queryBuilder
  }
}
