import { HttpStatus, Injectable } from '@nestjs/common'

import { PermissionRepository } from './provider/permission.repository'
import { PermissionInMemoryRepository } from './provider/permission.in-memory-repo'
import { Permission } from '/generated/permission/permission'
import { CreatePermissionRequestDto } from './dto/create-permission.dto'
import { Result, err, ok } from 'neverthrow'
import { GetPermissionConditionRequestDto } from './dto/get-permission-condition-request.dto'
import { PermissionListDataReply } from '/generated/permission/permission.reply'
import CustomException from 'lib/utils/custom.exception'

@Injectable()
export class PermissionService {
  constructor(
    private readonly repo: PermissionRepository,
    private readonly repoIMDB: PermissionInMemoryRepository,
  ) {}

  async onModuleInit() {
    console.log(`=== Start load Permission from Database ===`)
    const data = await this.repo.getList({})

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }

    const reply = await this.repoIMDB.createListPermission(
      data.value.permissionList,
    )

    if (reply.isErr()) {
      throw new CustomException(
        'ERROR',
        reply.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    console.log(`=== End load Permission from Database ===`)
  }

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
}
