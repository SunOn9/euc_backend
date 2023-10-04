import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { UtilsService } from './utils.service'
import { Global } from '@nestjs/common/decorators/modules/global.decorator'

@Global()
@Module({
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
