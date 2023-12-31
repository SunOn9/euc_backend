import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthEntity } from './entities/auth.entity'
import { AuthReflect } from './provider/auth.proto'
import { AuthRepository } from './provider/auth.repository'
import { UserModule } from '/user/user.module'
import { PassportModule } from '@nestjs/passport'
// import { LocalStrategy } from './guard/local.strategy'
// import { SessionSerializer } from './guard/session.serializer'
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db'
import { SessionModule } from '/session/session.module'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity]),
    UserModule,
    PassportModule.register({ session: true }),
    InMemoryDBModule.forFeature('auth', {}),
    SessionModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthReflect,
    AuthRepository,
    // LocalStrategy,
    // SessionSerializer,
  ],
  exports: [AuthService, AuthReflect, AuthRepository],
})
export class AuthModule {}
