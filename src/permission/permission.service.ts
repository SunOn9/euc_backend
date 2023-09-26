import { Injectable } from '@nestjs/common'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { PermissionRepository } from './provider/permission.repository'
import { PermissionInMemoryRepository } from './provider/permission.in-memory-repo'
import { PermissionEntity } from './entities/permission.entity'

@Injectable()
export class PermissionService {
  constructor(
    private readonly repo: PermissionRepository,
    private readonly repoIMDB: PermissionInMemoryRepository,
  ) {}
  async create(createPermissionDto: CreatePermissionDto) {
    const data = {
      id: createPermissionDto.id,
      user: null,
    } as PermissionEntity
    return await this.repoIMDB.createPermission(data)
  }

  async findAll() {
    return await this.repoIMDB.getAllPermission()
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} permission`;
  // }

  // update(id: number, updatePermissionDto: UpdatePermissionDto) {
  //   return `This action updates a #${id} permission`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} permission`;
  // }
}
