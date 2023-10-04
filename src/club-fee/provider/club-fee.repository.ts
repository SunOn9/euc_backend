import { UtilsService } from 'lib/utils'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Result, err, ok } from 'neverthrow'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { ClubFeeEntity } from '../entities/club-fee.entity'
import { ClubFee } from '/generated/club-fee/club-fee'
import { ClubFeeListDataReply } from '/generated/club-fee/club-fee.reply'
import { ClubFeeReflect } from './club-fee.proto'
import { CreateClubFeeRequestDto } from '../dto/create-club-fee.dto'
import { GetClubFeeConditionRequestDto } from '../dto/get-club-fee-condition-request.dto'
import { RemoveClubFeeRequestDto } from '../dto/remove-club-fee.dto'

@Injectable()
export class ClubFeeRepository extends Repository<ClubFeeEntity> {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private cache: Cache,
    private dataSource: DataSource,
    private proto: ClubFeeReflect,
    private utilService: UtilsService,
  ) {
    super(ClubFeeEntity, dataSource.createEntityManager())
  }

  async createClubFee(
    createData: CreateClubFeeRequestDto,
  ): Promise<Result<ClubFee, Error>> {
    try {
      const saveData: Partial<ClubFeeEntity> = {
        ...createData,
      }

      const dataReply = await this.save(saveData)

      if (this.utilService.isObjectEmpty(dataReply)) {
        return err(new Error(`Cannot create club-fee in database`))
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getDetail(
    conditions: GetClubFeeConditionRequestDto,
  ): Promise<Result<ClubFee, Error>> {
    try {
      if (this.utilService.isObjectEmpty(conditions)) {
        return err(new Error(`Empty conditions`))
      }

      const queryBuilder = this.setupQueryCondition(conditions)

      const dataReply = await queryBuilder.orderBy(`id`, 'DESC').getOne()

      if (!dataReply) {
        return err(
          new Error(`Cannot get club-fee with conditions: [${conditions}]`),
        )
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getList(
    conditions: GetClubFeeConditionRequestDto,
  ): Promise<Result<ClubFeeListDataReply, Error>> {
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
            `Cannot get list club-fee with conditions: [${conditions}]`,
          ),
        )
      }

      const clubFeeList: ClubFee[] = dataReply.map(each => {
        return this.proto.reflect(each)
      })

      return ok({
        total,
        page,
        limit,
        clubFeeList,
      })
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async removeClubFee(
    removeData: RemoveClubFeeRequestDto,
  ): Promise<Result<boolean, Error>> {
    const dataReply = await this.softDelete(removeData)

    if (this.utilService.isObjectEmpty(dataReply)) {
      return err(new Error(`Error when remove club-fee`))
    }

    return ok(true)
  }

  setupQueryCondition(
    conditions: GetClubFeeConditionRequestDto,
  ): SelectQueryBuilder<ClubFeeEntity> {
    const queryBuilder = this.createQueryBuilder(ClubFeeEntity.tableName)

    if (conditions.id !== undefined) {
      queryBuilder.andWhere(`id = :id`, {
        id: `${conditions.id}`,
      })
    }

    if (conditions.studentFee !== undefined) {
      queryBuilder.andWhere(`student_fee = :studentFee`, {
        studentFee: `${conditions.studentFee}`,
      })
    }

    if (conditions.workerFee !== undefined) {
      queryBuilder.andWhere(`worker_fee = :workerFee`, {
        workerFee: `${conditions.workerFee}`,
      })
    }

    if (conditions.monthlyFee !== undefined) {
      queryBuilder.andWhere(`monthly_fee = :monthlyFee`, {
        monthlyFee: `${conditions.monthlyFee}`,
      })
    }

    if (conditions.isDeleted) {
      queryBuilder.withDeleted()
    }

    queryBuilder.setFindOptions({
      relationLoadStrategy: 'query',
      relations: {
        club: conditions.isExtraClub ?? false,
      },
    })

    return queryBuilder
  }
}
