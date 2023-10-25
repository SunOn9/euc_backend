import { UtilsService } from 'lib/utils'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Result, err, ok } from 'neverthrow'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { PlaceReflect } from './place.proto'
import { PlaceEntity } from '../entities/place.entity'
import { Place } from '/generated/place/place'
import { PlaceListDataReply } from '/generated/place/place.reply'
import { CreatePlaceRequestDto } from '../dto/create-place.dto'
import { GetPlaceConditionRequestDto } from '../dto/get-place-condition-request.dto'
import { RemovePlaceRequestDto } from '../dto/remove-place.dto'
import { UpdatePlaceRequestDto } from '../dto/update-place.dto'

@Injectable()
export class PlaceRepository extends Repository<PlaceEntity> {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private cache: Cache,
    private dataSource: DataSource,
    private proto: PlaceReflect,
    private utilService: UtilsService,
  ) {
    super(PlaceEntity, dataSource.createEntityManager())
  }

  async createPlace(
    createData: CreatePlaceRequestDto,
  ): Promise<Result<Place, Error>> {
    try {
      const saveData = {
        ...createData,
      } as PlaceEntity

      const dataReply = await this.save(saveData)

      if (this.utilService.isObjectEmpty(dataReply)) {
        return err(new Error(`Cannot create place in database`))
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async updatePlace(
    updateData: UpdatePlaceRequestDto,
  ): Promise<Result<Place, Error>> {
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
    conditions: GetPlaceConditionRequestDto,
  ): Promise<Result<Place, Error>> {
    try {
      if (this.utilService.isObjectEmpty(conditions)) {
        return err(new Error(`Empty conditions`))
      }

      const queryBuilder = this.setupQueryCondition(conditions)

      const dataReply = await queryBuilder.orderBy(`id`, 'DESC').getOne()

      if (!dataReply) {
        return err(
          new Error(`Cannot get place with conditions: [${conditions}]`),
        )
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getList(
    conditions: GetPlaceConditionRequestDto,
  ): Promise<Result<PlaceListDataReply, Error>> {
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
          new Error(`Cannot get list place with conditions: [${conditions}]`),
        )
      }

      const placeList: Place[] = dataReply.map(each => {
        return this.proto.reflect(each)
      })

      return ok({
        total,
        page,
        limit,
        placeList,
      })
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async removePlace(
    removeData: RemovePlaceRequestDto,
  ): Promise<Result<boolean, Error>> {
    const dataReply = await this.softDelete(removeData)

    if (this.utilService.isObjectEmpty(dataReply)) {
      return err(new Error(`Error when remove place`))
    }

    return ok(true)
  }

  setupQueryCondition(
    conditions: GetPlaceConditionRequestDto,
  ): SelectQueryBuilder<PlaceEntity> {
    const queryBuilder = this.createQueryBuilder(PlaceEntity.tableName)

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

    if (conditions.fee !== undefined) {
      queryBuilder.andWhere(`fee = :fee`, {
        fee: `${conditions.fee}`,
      })
    }

    if (conditions.address !== undefined) {
      queryBuilder.andWhere(`address LIKE :address`, {
        address: `%${conditions.address}%`,
      })
    }

    if (conditions.isDeleted) {
      queryBuilder.withDeleted()
    }

    // queryBuilder.setFindOptions({
    //   relationLoadStrategy: 'query',
    //   relations: {

    //   },
    // })

    return queryBuilder
  }
}
