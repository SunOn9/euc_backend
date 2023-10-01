import { Module } from '@nestjs/common'
import { PermissionService } from './permission.service'
import { PermissionController } from './permission.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PermissionEntity } from './entities/permission.entity'
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db'
import { PermissionInMemoryRepository } from './provider/permission.in-memory-repo'
import { PermissionRepository } from './provider/permission.repository'
import { PermissionReflect } from './provider/permission.proto'
import { CaslAbilityFactory } from './casl/casl-ability.factory'
import { SessionModule } from '/session/session.module'
import { PermissionsGuard } from './guard/permission.guard'

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionEntity]),
    InMemoryDBModule.forFeature('permission', {}),
    SessionModule
  ],
  controllers: [PermissionController],
  providers: [
    PermissionService,
    PermissionRepository,
    PermissionInMemoryRepository,
    PermissionReflect,
    CaslAbilityFactory,
    PermissionsGuard
  ],
  exports: [PermissionsGuard, CaslAbilityFactory]
})
export class PermissionModule { }
