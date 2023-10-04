import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { PermissionRepository } from './provider/permission.repository'
import { PermissionInMemoryRepository } from './provider/permission.in-memory-repo'
import { Permission } from '/generated/permission/permission'
import { CreatePermissionRequestDto } from './dto/create-permission.dto'
import { Result, err, ok } from 'neverthrow'
import { GetPermissionConditionRequestDto } from './dto/get-permission-condition-request.dto'
import { PermissionListDataReply } from '/generated/permission/permission.reply'
// import CustomException from 'lib/utils/custom.exception'
import { UpdatePermissionRequestDto } from './dto/update-permission.dto'
import { RemovePermissionRequestDto } from './dto/remove-permission.dto'

@Injectable()
export class PermissionService {
  constructor(
    private readonly repo: PermissionRepository,
    private readonly repoIMDB: PermissionInMemoryRepository,
  ) {}

  async create(
    createData: CreatePermissionRequestDto,
  ): Promise<Result<Permission, Error>> {
    const dataReply = await this.repo.createPermission(createData)

    if (dataReply.isErr()) {
      return err(dataReply.error)
    }

    await this.repoIMDB.createPermission(dataReply.value)

    return ok(dataReply.value)
  }

  async update(requestData: UpdatePermissionRequestDto) {
    //Check permission
    const permissionReply = await this.getDetail(requestData.conditions)

    if (permissionReply.isErr()) {
      return err(permissionReply.error)
    }

    const updateReply = await this.repo.updatePermission(requestData)

    if (updateReply.isErr()) {
      return err(updateReply.error)
    }

    await this.repoIMDB.updatePermission(updateReply.value)

    return updateReply
  }

  async remove(requestData: RemovePermissionRequestDto) {
    const permissionReply = await this.getDetail({
      id: requestData.id,
    })

    if (permissionReply.isErr()) {
      return err(permissionReply.error)
    }

    const removeReply = await this.repo.removePermission(requestData)

    if (removeReply.isErr()) {
      return err(removeReply.error)
    }

    await this.repoIMDB.removePermission({ id: requestData.id })

    return removeReply
  }

  async getDetail(
    request: GetPermissionConditionRequestDto,
  ): Promise<Result<Permission, Error>> {
    return await this.repo.getDetail(request)
  }

  async getList(
    request: GetPermissionConditionRequestDto,
  ): Promise<Result<PermissionListDataReply, Error>> {
    return await this.repo.getList(request)
  }

  async getAllPermissionInMemory() {
    return await this.repoIMDB.getAllPermission()
  }

  // async getDetailInMemory(request: GetPermissionConditionRequestDto) {
  //   return await this.repoIMDB.getPermission(request.id)
  // }
}
