import { UtilsService } from 'lib/utils'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Result, err, ok } from 'neverthrow'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { LogReflect } from './log.proto'
import { LogEntity } from '../entities/log.entity'
import { Log } from '/generated/log/log'
import { LogListDataReply } from '/generated/log/log.reply'
import { CreateLogRequestDto } from '../dto/create-log.dto'
import { GetLogConditionRequestDto } from '../dto/get-log-condition-request.dto'

@Injectable()
export class LogRepository extends Repository<LogEntity> {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private cache: Cache,
    private dataSource: DataSource,
    private proto: LogReflect,
    private utilService: UtilsService,
  ) {
    super(LogEntity, dataSource.createEntityManager())
  }

  async createLog(
    createData: CreateLogRequestDto,
  ): Promise<Result<Log, Error>> {
    try {
      const saveData = {
        ...createData,
      } as LogEntity

      const dataReply = await this.save(saveData)

      if (this.utilService.isObjectEmpty(dataReply)) {
        return err(new Error(`Cannot create log in database`))
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getDetail(
    conditions: GetLogConditionRequestDto,
  ): Promise<Result<Log, Error>> {
    try {
      if (this.utilService.isObjectEmpty(conditions)) {
        return err(new Error(`Empty conditions`))
      }

      const queryBuilder = this.setupQueryCondition(conditions)

      const dataReply = await queryBuilder.orderBy(`id`, 'DESC').getOne()

      if (!dataReply) {
        return err(new Error(`Cannot get log with conditions: [${conditions}]`))
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getList(
    conditions: GetLogConditionRequestDto,
  ): Promise<Result<LogListDataReply, Error>> {
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
          new Error(`Cannot get list log with conditions: [${conditions}]`),
        )
      }

      const logList: Log[] = dataReply.map(each => {
        return this.proto.reflect(each)
      })

      return ok({
        total,
        page,
        limit,
        logList,
      })
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  setupQueryCondition(
    conditions: GetLogConditionRequestDto,
  ): SelectQueryBuilder<LogEntity> {
    const queryBuilder = this.createQueryBuilder(LogEntity.tableName)

    if (conditions.id !== undefined) {
      queryBuilder.andWhere(`id = :id`, {
        id: `${conditions.id}`,
      })
    }

    queryBuilder.setFindOptions({
      relationLoadStrategy: 'query',
      relations: {
        user: conditions.isExtraUser ?? false,
      },
    })

    return queryBuilder
  }
}
