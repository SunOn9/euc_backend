import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { CreateUserRequestDto } from './dto/create-user.dto'
import { UserRepository } from './provider/user.repository'
import * as bcrypt from 'bcrypt'
import { GetUserConditionRequestDto } from './dto/get-user-condition-request.dto'
import { UpdateUserRequestDto } from './dto/update-user.dto'
import { RemoveUserRequestDto } from './dto/remove-user.dto'
import { err } from 'neverthrow'
import { UpdateUserPermissionRequestDto } from './dto/update-user-permission.dto'

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) { }

  async create(requestData: CreateUserRequestDto) {
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

    return await this.repo.createUser(requestData)
  }

  async getDetail(requestData: GetUserConditionRequestDto) {
    return await this.repo.getDetail(requestData)
  }

  async getList(requestData: GetUserConditionRequestDto) {
    return await this.repo.getList(requestData)
  }

  async update(requestData: UpdateUserRequestDto) {
    return await this.repo.updateUser(requestData)
  }

  async remove(requestData: RemoveUserRequestDto) {
    //Check user
    const userReply = await this.getDetail({
      id: requestData.id,
    })

    if (userReply.isErr()) {
      return err(userReply.error)
    }

    return await this.repo.removeUser(requestData)
  }

  async updateUserPermission(requestData: UpdateUserPermissionRequestDto) {
    const userReply = await this.repo.getDetail({
      id: requestData.id
    })

    if (userReply.isErr()) {
      return err(userReply.error)
    }

    return await this.repo.updateUserPermission(requestData)
  }

  //TODO: Log

}
