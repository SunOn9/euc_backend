import { InMemoryDBModule } from '@nestjs-addons/in-memory-db'
import { SessionService } from './session.service'
import { SessionInMemoryRepository } from './provider/session.in-memory-repo'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'

@Module({
  imports: [InMemoryDBModule.forFeature('session', {})],
  providers: [SessionService, SessionInMemoryRepository],
  exports: [SessionService, SessionInMemoryRepository],
})
export class SessionModule {}
