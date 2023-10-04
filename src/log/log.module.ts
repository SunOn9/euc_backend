import { LogService } from './log.service'
import { LogController } from './log.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'

@Module({
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {}
