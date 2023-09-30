import { Module } from '@nestjs/common'
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db'
import { SessionService } from './session.service'
import { SessionInMemoryRepository } from './provider/session.in-memory-repo'

@Module({
  imports: [InMemoryDBModule.forFeature('session', {})],
  providers: [SessionService, SessionInMemoryRepository],
  exports: [SessionService, SessionInMemoryRepository],
})
export class SessionModule { }
