import { UtilsService } from 'lib/utils'
import { UserEntity } from '../entities/user.entity'
import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { User } from '/generated/user/user'
import { Result, err, ok } from 'neverthrow'
import { CreateUserRequestDto } from '../dto/create-user.dto'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { UserReflect } from './user.proto'
import { GetUserConditionRequestDto } from '../dto/get-user-condition-request.dto'
import { UserListDataReply } from '/generated/user/user.reply'
import { UpdateUserRequestDto } from '../dto/update-user.dto'
import { RemoveUserRequestDto } from '../dto/remove-user.dto'

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private cache: Cache,
    private dataSource: DataSource,
    private proto: UserReflect,
    private utilService: UtilsService,
  ) {
    super(UserEntity, dataSource.createEntityManager())
  }

  async createUser(
    createData: CreateUserRequestDto,
  ): Promise<Result<User, Error>> {
    try {
      const dataReply = await this.save(createData)

      if (this.utilService.isObjectEmpty(dataReply)) {
        return err(new Error(`Cannot create user in database`))
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async updateUser(
    updateData: UpdateUserRequestDto,
  ): Promise<Result<User, Error>> {
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
    conditions: GetUserConditionRequestDto,
  ): Promise<Result<User, Error>> {
    try {
      if (this.utilService.isObjectEmpty(conditions)) {
        return err(new Error(`Empty conditions`))
      }
      const dataReply = await this.findOneBy(conditions)

      if (!dataReply) {
        return err(
          new Error(`Cannot get user with conditions: [${conditions}]`),
        )
      }
      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  //TODO: getDetailWithExtraData

  async getList(
    conditions: GetUserConditionRequestDto,
  ): Promise<Result<UserListDataReply, Error>> {
    try {
      // if (!conditions) {
      //   return err(new Error(`Empty conditions`));
      // }

      const page = conditions.page ? conditions.page : 1
      const limit = conditions.limit ? conditions.limit : 20
      const skip: number = limit * page - limit

      const [dataReply, total] = await this.findAndCount({
        where: { ...conditions },
        take: limit,
        skip: skip,
        order: {
          name: 'ASC',
        },
      })

      if (!dataReply) {
        return err(
          new Error(`Cannot get list user with conditions: [${conditions}]`),
        )
      }

      const userList: User[] = dataReply.map(each => {
        return this.proto.reflect(each)
      })

      return ok({
        total,
        page,
        limit,
        userList,
      })

    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  //TODO: GetListWithExtraData
  async removeUser(
    removeData: RemoveUserRequestDto,
  ): Promise<Result<boolean, Error>> {
    const dataReply = await this.softDelete(removeData)

    if (this.utilService.isObjectEmpty(dataReply)) {
      return err(new Error(`Error when remove user`))
    }

    return ok(true)
  }
}
