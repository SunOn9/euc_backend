import { UtilsService } from 'lib/utils'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Result, err, ok } from 'neverthrow'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { PermissionEntity } from '../entities/permission.entity'
import { PermissionReflect } from './permission.proto'
import { CreatePermissionRequestDto } from '../dto/create-permission.dto'
import { Permission } from '/generated/permission/permission'
import { GetPermissionConditionRequestDto } from '../dto/get-permission-condition-request.dto'
import { PermissionListDataReply } from '/generated/permission/permission.reply'
import { UpdatePermissionRequestDto } from '../dto/update-permission.dto'
import { RemovePermissionRequestDto } from '../dto/remove-permission.dto'

@Injectable()
export class PermissionRepository extends Repository<PermissionEntity> {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private cache: Cache,
    private dataSource: DataSource,
    private proto: PermissionReflect,
    private utilService: UtilsService,
  ) {
    super(PermissionEntity, dataSource.createEntityManager())
  }

  async createPermission(
    createData: CreatePermissionRequestDto,
  ): Promise<Result<Permission, Error>> {
    try {
      const { rules, ...other } = createData

      const data = {
        rules: rules,
        ...other,
      } as PermissionEntity

      const dataReply = await this.save(data)

      if (this.utilService.isObjectEmpty(dataReply)) {
        return err(new Error(`Cannot create Permission in database`))
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async updatePermission(
    updateData: UpdatePermissionRequestDto,
  ): Promise<Result<Permission, Error>> {
    try {
      if (this.utilService.isObjectEmpty(updateData.conditions)) {
        return err(new Error(`Empty conditions`))
      }

      const { rules, ...other } = updateData.data

      const data = {
        rules: rules,
        ...other,
      } as PermissionEntity

      await this.update(updateData.conditions, data)

      return await this.getDetail(updateData.conditions)
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getDetail(
    conditions: GetPermissionConditionRequestDto,
  ): Promise<Result<Permission, Error>> {
    try {
      if (this.utilService.isObjectEmpty(conditions)) {
        return err(new Error(`Empty conditions`))
      }

      const queryBuilder = this.setupQueryCondition(conditions)

      const dataReply = await queryBuilder.orderBy(`id`, 'DESC').getOne()

      if (!dataReply) {
        return err(
          new Error(`Cannot get permission with conditions: [${conditions}]`),
        )
      }
      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getList(
    conditions: GetPermissionConditionRequestDto,
  ): Promise<Result<PermissionListDataReply, Error>> {
    try {
      // if (!conditions) {
      //   return err(new Error(`Empty conditions`));
      // }

      const page = conditions.page ? conditions.page : 1
      const limit = conditions.limit ? conditions.limit : 20
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
            `Cannot get list Permission with conditions: [${conditions}]`,
          ),
        )
      }

      const permissionList: Permission[] = dataReply.map(each => {
        return this.proto.reflect(each)
      })

      return ok({
        total,
        page,
        limit,
        permissionList,
      })
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async removePermission(
    removeData: RemovePermissionRequestDto,
  ): Promise<Result<boolean, Error>> {
    const dataReply = await this.softDelete(removeData)

    if (this.utilService.isObjectEmpty(dataReply)) {
      return err(new Error(`Error when remove permission`))
    }

    return ok(true)
  }

  setupQueryCondition(
    conditions: GetPermissionConditionRequestDto,
  ): SelectQueryBuilder<PermissionEntity> {
    const queryBuilder = this.createQueryBuilder(PermissionEntity.tableName)

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

    return queryBuilder
  }
}
