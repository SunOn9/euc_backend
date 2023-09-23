import { UtilsService } from 'lib/utils'
import { PermissionEntity } from '../entities/Permission.entity'
import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Result, err, ok } from 'neverthrow'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'


@Injectable()
export class PermissionRepository extends Repository<PermissionEntity> {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private cache: Cache,
    private dataSource: DataSource,
    // private proto: PermissionReflect,
    private utilService: UtilsService,
  ) {
    super(PermissionEntity, dataSource.createEntityManager())
  }

  // async createPermission(
  //   createData: CreatePermissionRequestDto,
  // ): Promise<Result<Permission, Error>> {
  //   try {
  //     const dataReply = await this.save(createData)

  //     if (this.utilService.isObjectEmpty(dataReply)) {
  //       return err(new Error(`Cannot create Permission in database`))
  //     }

  //     return ok(this.proto.reflect(dataReply))
  //   } catch (e) {
  //     throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
  //   }
  // }

  // async updatePermission(
  //   updateData: UpdatePermissionRequestDto,
  // ): Promise<Result<Permission, Error>> {
  //   try {
  //     if (this.utilService.isObjectEmpty(updateData.conditions)) {
  //       return err(new Error(`Empty conditions`))
  //     }

  //     await this.update(updateData.conditions, updateData.data)

  //     return await this.getDetail(updateData.conditions)
  //   } catch (e) {
  //     throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
  //   }
  // }

  // async getDetail(
  //   conditions: GetPermissionConditionRequestDto,
  // ): Promise<Result<Permission, Error>> {
  //   try {
  //     if (this.utilService.isObjectEmpty(conditions)) {
  //       return err(new Error(`Empty conditions`))
  //     }
  //     const dataReply = await this.findOneBy(conditions)

  //     if (!dataReply) {
  //       return err(
  //         new Error(`Cannot get Permission with conditions: [${conditions}]`),
  //       )
  //     }
  //     return ok(this.proto.reflect(dataReply))
  //   } catch (e) {
  //     throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
  //   }
  // }

  // //TODO: getDetailWithExtraData

  // async getList(
  //   conditions: GetPermissionConditionRequestDto,
  // ): Promise<Result<PermissionListDataReply, Error>> {
  //   try {
  //     // if (!conditions) {
  //     //   return err(new Error(`Empty conditions`));
  //     // }

  //     const page = conditions.page ? conditions.page : 1
  //     const limit = conditions.limit ? conditions.limit : 20
  //     const skip: number = limit * page - limit

  //     const [dataReply, total] = await this.findAndCount({
  //       where: { ...conditions },
  //       take: limit,
  //       skip: skip,
  //       order: {
  //         name: 'ASC',
  //       },
  //     })

  //     if (!dataReply) {
  //       return err(
  //         new Error(`Cannot get list Permission with conditions: [${conditions}]`),
  //       )
  //     }

  //     const PermissionList: Permission[] = dataReply.map(each => {
  //       return this.proto.reflect(each)
  //     })

  //     return ok({
  //       total,
  //       page,
  //       limit,
  //       PermissionList,
  //     })

  //   } catch (e) {
  //     throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
  //   }
  // }

  // //TODO: GetListWithExtraData
  // async removePermission(
  //   removeData: RemovePermissionRequestDto,
  // ): Promise<Result<boolean, Error>> {
  //   const dataReply = await this.softDelete(removeData)

  //   if (this.utilService.isObjectEmpty(dataReply)) {
  //     return err(new Error(`Error when remove Permission`))
  //   }

  //   return ok(true)
  // }
}
