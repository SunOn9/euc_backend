import { UtilsService } from 'lib/utils'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Result, err, ok } from 'neverthrow'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { AreaReflect } from './area.proto'
import { AreaEntity } from '../entities/area.entity'
import { Area } from '/generated/area/area'
import { AreaListDataReply } from '/generated/area/area.reply'
import { CreateAreaRequestDto } from '../dto/create-area.dto'
import { GetAreaConditionRequestDto } from '../dto/get-area-condition-request.dto'
import { RemoveAreaRequestDto } from '../dto/remove-area.dto'
import { UpdateAreaRequestDto } from '../dto/update-area.dto'

@Injectable()
export class AreaRepository extends Repository<AreaEntity> {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private cache: Cache,
    private dataSource: DataSource,
    private proto: AreaReflect,
    private utilService: UtilsService,
  ) {
    super(AreaEntity, dataSource.createEntityManager())
  }

  async createArea(
    createData: CreateAreaRequestDto,
  ): Promise<Result<Area, Error>> {
    try {
      const saveData = {
        ...createData,
        slug: '',
      } as AreaEntity

      const dataReply = await this.save(saveData)

      if (this.utilService.isObjectEmpty(dataReply)) {
        return err(new Error(`Cannot create area in database`))
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async updateArea(
    updateData: UpdateAreaRequestDto,
  ): Promise<Result<Area, Error>> {
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
    conditions: GetAreaConditionRequestDto,
  ): Promise<Result<Area, Error>> {
    try {
      if (this.utilService.isObjectEmpty(conditions)) {
        return err(new Error(`Empty conditions`))
      }

      const queryBuilder = this.setupQueryCondition(conditions)

      const dataReply = await queryBuilder.orderBy(`id`, 'DESC').getOne()

      if (!dataReply) {
        return err(
          new Error(`Cannot get area with conditions: [${conditions}]`),
        )
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getList(
    conditions: GetAreaConditionRequestDto,
  ): Promise<Result<AreaListDataReply, Error>> {
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
          new Error(`Cannot get list area with conditions: [${conditions}]`),
        )
      }

      const areaList: Area[] = dataReply.map(each => {
        return this.proto.reflect(each)
      })

      return ok({
        total,
        page,
        limit,
        areaList,
      })
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async removeArea(
    removeData: RemoveAreaRequestDto,
  ): Promise<Result<boolean, Error>> {
    const dataReply = await this.softDelete(removeData)

    if (this.utilService.isObjectEmpty(dataReply)) {
      return err(new Error(`Error when remove area`))
    }

    return ok(true)
  }

  setupQueryCondition(
    conditions: GetAreaConditionRequestDto,
  ): SelectQueryBuilder<AreaEntity> {
    const queryBuilder = this.createQueryBuilder(AreaEntity.tableName)

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

    if (conditions.slug !== undefined) {
      queryBuilder.andWhere(`slug LIKE :slug`, {
        slug: `%${conditions.slug}%`,
      })
    }

    if (conditions.isDeleted) {
      queryBuilder.withDeleted()
    }


    queryBuilder.setFindOptions({
      relationLoadStrategy: 'query',
      relations: {
        club: conditions.isExtraClub ?? false,
        member: conditions.isExtraMember ?? false,
      },
    })

    return queryBuilder
  }
}
