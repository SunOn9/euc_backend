import { UtilsService } from 'lib/utils'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Result, err, ok } from 'neverthrow'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { ClubEntity } from '../entities/club.entity'
import { ClubReflect } from './club.proto'
import { CreateClubRequestDto } from '../dto/create-club.dto'
import { Club } from '/generated/club/club'
import { GetClubConditionRequestDto } from '../dto/get-club-condition-request.dto'
import { UpdateClubRequestDto } from '../dto/update-club.dto'
import { ClubListDataReply } from '/generated/club/club.reply'
import { RemoveClubRequestDto } from '../dto/remove-club.dto'
import { AreaEntity } from '/area/entities/area.entity'

@Injectable()
export class ClubRepository extends Repository<ClubEntity> {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private cache: Cache,
    private dataSource: DataSource,
    private proto: ClubReflect,
    private utilService: UtilsService,
  ) {
    super(ClubEntity, dataSource.createEntityManager())
  }

  async createClub(
    createData: CreateClubRequestDto,
  ): Promise<Result<Club, Error>> {
    try {
      const { areaId, ...other } = createData

      const saveData: Partial<ClubEntity> = {
        ...other,
        area: { id: areaId } as AreaEntity,
      }

      const dataReply = await this.save(saveData)

      if (this.utilService.isObjectEmpty(dataReply)) {
        return err(new Error(`Cannot create club in database`))
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async updateClub(
    updateData: UpdateClubRequestDto,
  ): Promise<Result<Club, Error>> {
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
    conditions: GetClubConditionRequestDto,
  ): Promise<Result<Club, Error>> {
    try {
      if (this.utilService.isObjectEmpty(conditions)) {
        return err(new Error(`Empty conditions`))
      }

      const queryBuilder = this.setupQueryCondition(conditions)

      const dataReply = await queryBuilder.orderBy(`id`, 'DESC').getOne()

      if (!dataReply) {
        return err(
          new Error(`Cannot get club with conditions: [${conditions}]`),
        )
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getList(
    conditions: GetClubConditionRequestDto,
  ): Promise<Result<ClubListDataReply, Error>> {
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
          new Error(`Cannot get list club with conditions: [${conditions}]`),
        )
      }

      const clubList: Club[] = dataReply.map(each => {
        return this.proto.reflect(each)
      })

      return ok({
        total,
        page,
        limit,
        clubList,
      })
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async removeClub(
    removeData: RemoveClubRequestDto,
  ): Promise<Result<boolean, Error>> {
    const dataReply = await this.softDelete(removeData)

    if (this.utilService.isObjectEmpty(dataReply)) {
      return err(new Error(`Error when remove club`))
    }

    return ok(true)
  }

  setupQueryCondition(
    conditions: GetClubConditionRequestDto,
  ): SelectQueryBuilder<ClubEntity> {
    const queryBuilder = this.createQueryBuilder(ClubEntity.tableName)

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

    if (conditions.fund !== undefined) {
      queryBuilder.andWhere(`fund LIKE :fund`, {
        fund: `%${conditions.fund}%`,
      })
    }

    if (conditions.totalMember !== undefined) {
      queryBuilder.andWhere(`total_member LIKE :totalMember`, {
        totalMember: `%${conditions.totalMember}%`,
      })
    }

    if (conditions.isDeleted) {
      queryBuilder.withDeleted()
    }

    queryBuilder.setFindOptions({
      relationLoadStrategy: 'query',
      relations: {
        fee: conditions.isExtraClubFee ?? false,
        area: conditions.isExtraArea ?? false,
      },
    })

    return queryBuilder
  }
}
