import { UtilsService } from 'lib/utils'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Result, err, ok } from 'neverthrow'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { CreateGuestRequestDto } from '../dto/create-guest.dto'
import { GetGuestConditionRequestDto } from '../dto/get-guest-condition-request.dto'
import { RemoveGuestRequestDto } from '../dto/remove-guest.dto'
import { UpdateGuestRequestDto } from '../dto/update-guest.dto'
import { GuestEntity } from '../entities/guest.entity'
import { GuestReflect } from './guest.proto'
import { Guest } from '/generated/guest/guest'
import { GuestListDataReply } from '/generated/guest/guest.reply'

@Injectable()
export class GuestRepository extends Repository<GuestEntity> {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private cache: Cache,
    private dataSource: DataSource,
    private proto: GuestReflect,
    private utilService: UtilsService,
  ) {
    super(GuestEntity, dataSource.createEntityManager())
  }

  async createGuest(
    createData: CreateGuestRequestDto,
  ): Promise<Result<Guest, Error>> {
    try {
      const { clubId, ...other } = createData

      const saveData = {
        ...other,
        club: {
          id: clubId,
        },
      } as GuestEntity

      const dataReply = await this.save(saveData)

      if (this.utilService.isObjectEmpty(dataReply)) {
        return err(new Error(`Cannot create guest in database`))
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async updateGuest(
    updateData: UpdateGuestRequestDto,
  ): Promise<Result<Guest, Error>> {
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
    conditions: GetGuestConditionRequestDto,
  ): Promise<Result<Guest, Error>> {
    try {
      if (this.utilService.isObjectEmpty(conditions)) {
        return err(new Error(`Empty conditions`))
      }

      const queryBuilder = this.setupQueryCondition(conditions)

      const dataReply = await queryBuilder.orderBy(`id`, 'DESC').getOne()

      if (!dataReply) {
        return err(
          new Error(`Cannot get guest with conditions: [${conditions}]`),
        )
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getList(
    conditions: GetGuestConditionRequestDto,
  ): Promise<Result<GuestListDataReply, Error>> {
    try {
      // if (!conditions) {
      //   return err(new Error(`Empty conditions`));
      // }

      const page = conditions.page ?? 1
      const limit = conditions.limit ?? 20
      const skip: number = limit * page - limit

      const queryBuilder = this.setupQueryCondition(conditions)

      const [dataReply, total] = await queryBuilder
        .orderBy(`${GuestEntity.tableName}.id`, 'DESC')
        .take(limit)
        .skip(skip)
        .getManyAndCount()

      if (!dataReply) {
        return err(
          new Error(`Cannot get list guest with conditions: [${conditions}]`),
        )
      }

      const guestList: Guest[] = dataReply.map(each => {
        return this.proto.reflect(each)
      })

      return ok({
        total,
        page,
        limit,
        guestList,
      })
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async removeGuest(
    removeData: RemoveGuestRequestDto,
  ): Promise<Result<boolean, Error>> {
    const dataReply = await this.softDelete(removeData)

    if (this.utilService.isObjectEmpty(dataReply)) {
      return err(new Error(`Error when remove guest`))
    }

    return ok(true)
  }

  setupQueryCondition(
    conditions: GetGuestConditionRequestDto,
  ): SelectQueryBuilder<GuestEntity> {
    const queryBuilder = this.createQueryBuilder(GuestEntity.tableName)

    if (conditions.id !== undefined) {
      queryBuilder.andWhere(`${GuestEntity.tableName}.id = :id`, {
        id: `${conditions.id}`,
      })
    }

    if (conditions.clubId !== undefined) {
      queryBuilder.andWhere(`${GuestEntity.tableName}.club_id = :clubId`, {
        clubId: `${conditions.clubId}`,
      })
    }


    if (conditions.name !== undefined) {
      queryBuilder.andWhere(`${GuestEntity.tableName}.name LIKE :name`, {
        name: `%${conditions.name}%`,
      })
    }

    if (conditions.nickName !== undefined) {
      queryBuilder.andWhere(`${GuestEntity.tableName}.nick_name LIKE :nickName`, {
        nickName: `%${conditions.nickName}%`,
      })
    }

    if (conditions.type !== undefined) {
      queryBuilder.andWhere(`${GuestEntity.tableName}.type = :type`, {
        type: `${conditions.type}`,
      })
    }

    if (conditions.isDeleted) {
      queryBuilder.withDeleted()
    }

    queryBuilder.setFindOptions({
      relationLoadStrategy: 'query',
      relations: {
        club: conditions.isExtraClub ?? false,
        event: conditions.isExtraEvent ?? false,
      },
    })

    return queryBuilder
  }
}
