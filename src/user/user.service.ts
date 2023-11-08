import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { CreateUserRequestDto } from './dto/create-user.dto'
import { UserRepository } from './provider/user.repository'
import * as bcrypt from 'bcrypt'
import { GetUserConditionRequestDto } from './dto/get-user-condition-request.dto'
import { UpdateUserRequestDto } from './dto/update-user.dto'
import { RemoveUserRequestDto } from './dto/remove-user.dto'
import { err } from 'neverthrow'
import { UpdateUserPermissionRequestDto } from './dto/update-user-permission.dto'
import { User } from '/generated/user/user'
import { LogService } from '/log/log.service'
import { UserEntity } from './entities/user.entity'
import { Action } from '/permission/casl/casl.type'

@Injectable()
export class UserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly logService: LogService,
  ) {}

  //TODO: Create -> Auto generated password and send to email
  //TODO: Change password
  //TODO: Email module

  async create(
    requestData: CreateUserRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    //Check user exits
    const userReply = await this.getDetail({
      email: requestData.email,
    })

    if (userReply.isOk()) {
      return err(
        new Error(`User already exits with email: [${requestData.email}]`),
      )
    }

    requestData.password = await bcrypt.hash(requestData.password, 10)

    const createReply = await this.repo.createUser(requestData)

    if (createReply.isOk()) {
      await this.logService.create({
        action: Action.CREATE,
        subject: UserEntity.tableName,
        newData: createReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }
    return createReply
  }

  async getDetail(requestData: GetUserConditionRequestDto) {
    return await this.repo.getDetail(requestData)
  }

  async getList(requestData: GetUserConditionRequestDto) {
    return await this.repo.getList(requestData)
  }

  async update(
    requestData: UpdateUserRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const userReply = await this.repo.getDetail(requestData.conditions)

    if (userReply.isErr()) {
      return err(userReply.error)
    }

    const updateReply = await this.repo.updateUser(requestData)

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.UPDATE,
        subject: UserEntity.tableName,
        oldData: userReply.value,
        newData: updateReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return updateReply
  }

  async remove(
    requestData: RemoveUserRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    //Check user
    const userReply = await this.repo.getDetail({
      id: requestData.id,
    })

    if (userReply.isErr()) {
      return err(userReply.error)
    }

    const removeReply = await this.repo.removeUser(requestData)

    if (removeReply.isOk()) {
      await this.logService.create({
        action: Action.DELETE,
        subject: UserEntity.tableName,
        oldData: userReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return removeReply
  }

  async updateUserPermission(
    requestData: UpdateUserPermissionRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const userReply = await this.repo.getDetail({
      id: requestData.id,
    })

    if (userReply.isErr()) {
      return err(userReply.error)
    }

    const updateReply = await this.repo.updateUserPermission(requestData)

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.UPDATE,
        subject: UserEntity.tableName,
        oldData: userReply.value,
        newData: updateReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return updateReply
  }
}
