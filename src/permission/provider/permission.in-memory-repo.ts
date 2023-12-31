import { UtilsService } from 'lib/utils'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Result, err, ok } from 'neverthrow'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { InMemoryDBService } from '@nestjs-addons/in-memory-db/src/services/in-memory-db.service'
import { Permission } from '/generated/permission/permission'

interface PermissionInMemory extends Omit<Permission, 'id'> {
  id: string
}

@Injectable()
export class PermissionInMemoryRepository extends InMemoryDBService<PermissionInMemory> {
  constructor(private ultilService: UtilsService) {
    super({ featureName: 'permission' })
  }

  async createPermission(
    createData: Permission,
  ): Promise<Result<boolean, Error>> {
    try {
      const { id, ...other } = createData
      const data = this.create({
        id: id.toString(),
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

  async createListPermission(
    createData: Permission[],
  ): Promise<Result<boolean, Error>> {
    try {
      createData.map(each => {
        const { id, ...other } = each
        const data = this.create({
          id: id.toString(),
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

  async updatePermission(
    updateData: Permission,
  ): Promise<Result<boolean, Error>> {
    try {
      const { id, ...other } = updateData

      const request = {
        id: id.toString(),
        ...other,
      } as PermissionInMemory

      const data = this.update(request)

      if (this.ultilService.isObjectEmpty(data)) {
        return err(new Error(`Cannot update permission in memory`))
      }

      return ok(true)
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async removePermission(
    removeData: Partial<Permission>,
  ): Promise<Result<boolean, Error>> {
    try {
      const permissionReply = this.get(removeData.id.toString())

      if (this.ultilService.isObjectEmpty(permissionReply)) {
        return err(
          new Error(`Cannot get permission with id: [${removeData.id}]`),
        )
      }

      this.delete(removeData.id.toString())

      return ok(true)
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getPermission(
    permissionId: number,
  ): Promise<Result<Permission, Error>> {
    try {
      const permissionReply = this.get(permissionId.toString())

      if (this.ultilService.isObjectEmpty(permissionReply)) {
        return err(
          new Error(`Cannot get permission with id: [${permissionId}]`),
        )
      }

      const { id, ...other } = permissionReply

      const reply = {
        id: Number(id),
        ...other,
      } as Permission

      return ok(reply)
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getAllPermission(): Promise<Result<any, Error>> {
    const reply = this.getAll()
    return ok(reply)
  }
}
