import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { CreateUserRequestDto } from './dto/create-user.dto'
import { UserRepository } from './provider/user.repository'
import { GetUserConditionRequestDto } from './dto/get-user-condition-request.dto'
import { UpdateUserRequestDto } from './dto/update-user.dto'
import { RemoveUserRequestDto } from './dto/remove-user.dto'
import { err } from 'neverthrow'
import { UpdateUserPermissionRequestDto } from './dto/update-user-permission.dto'
import { User } from '/generated/user/user'
import { LogService } from '/log/log.service'
import { UserEntity } from './entities/user.entity'
import { Action } from '/permission/casl/casl.type'
import { UpdatePasswordRequestDto } from './dto/update-password.dto'
import { SessionService } from '/session/session.service'

@Injectable()
export class UserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly logService: LogService,
    private readonly sessionService: SessionService,
  ) { }

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

  async resetPassword(userId: number) {
    return await this.repo.resetPassord(userId)
  }

  async updatePassword(sessionId: string, userId: number, request: UpdatePasswordRequestDto) {
    const reply = await this.repo.updatePassword(userId, request)

    if (reply.isErr()) {
      return err(reply.error)
    }

    await this.sessionService.del(sessionId)

    return reply
  }
}
