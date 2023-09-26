import { Module } from '@nestjs/common'
import { PermissionService } from './permission.service'
import { PermissionController } from './permission.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PermissionEntity } from './entities/permission.entity'
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db'
import { PermissionInMemoryRepository } from './provider/permission.in-memory-repo'
import { PermissionRepository } from './provider/permission.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionEntity]),
    InMemoryDBModule.forFeature('permission', {}),
  ],
  controllers: [PermissionController],
  providers: [
    PermissionService,
    PermissionRepository,
    PermissionInMemoryRepository,
  ],
})
export class PermissionModule {}
