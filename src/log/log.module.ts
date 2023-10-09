import { LogService } from './log.service'
import { LogController } from './log.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LogEntity } from './entities/log.entity'
import { LogReflect } from './provider/log.proto'
import { LogRepository } from './provider/log.repository'

@Module({
  imports: [TypeOrmModule.forFeature([LogEntity])],
  controllers: [LogController],
  providers: [LogService, LogReflect, LogRepository],
})
export class LogModule {}
