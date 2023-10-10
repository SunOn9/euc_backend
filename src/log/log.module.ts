import { LogService } from './log.service'
import { LogController } from './log.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LogEntity } from './entities/log.entity'
import { LogReflect } from './provider/log.proto'
import { LogRepository } from './provider/log.repository'
import { Global } from '@nestjs/common'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LogEntity])],
  controllers: [LogController],
  providers: [LogService, LogReflect, LogRepository],
  exports: [LogService, LogReflect, LogRepository],
})
export class LogModule {}
