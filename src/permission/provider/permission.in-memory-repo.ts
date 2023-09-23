import { UtilsService } from 'lib/utils'
import { PermissionEntity } from '../entities/Permission.entity'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Result, err, ok } from 'neverthrow'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { InMemoryDBService } from '@nestjs-addons/in-memory-db/src/services/in-memory-db.service'

interface PermissionInMemory extends Omit<PermissionEntity, 'id'> {
  id: string
  table: string
}

@Injectable()
export class PermissionInMemoryRepository extends InMemoryDBService<PermissionInMemory> {
  constructor(
    private ultilService: UtilsService
  ) {
    super({ featureName: 'permission' })
  }

  async createPermission(createData: PermissionEntity): Promise<Result<boolean, Error>> {
    try {
      const { id, ...other } = createData
      const { table, ...data } = this.create({
        id: id.toString(),
        table: PermissionEntity.tableName,
        ...other,
      })

      if (this.ultilService.isObjectEmpty(data)) {
        return err(new Error(`Cannot create permission in memory`))
      }

      return ok(true)
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async createListPermission(createData: PermissionEntity[]): Promise<Result<boolean, Error>> {
    try {
      createData.map((each) => {
        const { id, ...other } = each
        const { table, ...data } = this.create({
          id: id.toString(),
          table: PermissionEntity.tableName,
          ...other,
        })

        if (this.ultilService.isObjectEmpty(data)) {
          return err(new Error(`Cannot create permission in memory`))
        }
      })

      return ok(true)
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async removePermission(removeData: Partial<PermissionEntity>): Promise<Result<boolean, Error>> {
    try {
      const permissionReply = this.get(removeData.id.toString())

      if (this.ultilService.isObjectEmpty(permissionReply)) {
        return err(new Error(`Cannot get permission with id: [${permissionReply.id}]`))
      }

      this.delete(removeData.id.toString())

      return ok(true)
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }
}
