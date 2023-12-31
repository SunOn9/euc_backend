import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db'
// import { ElasticsearchModule } from '@nestjs/elasticsearch';
// import { BullModule } from '@nestjs/bull';
// import { CacheModule } from '@nestjs/cache-manager';
// import * as redisStore from 'cache-manager-redis-store';

import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { ReceiptModule } from './receipt/receipt.module'
import { PaymentModule } from './payment/payment.module'
import { EventModule } from './event/event.module'
import { GuestModule } from './guest/guest.module'
import { MemberModule } from './member/member.module'
import { ClubModule } from './club/club.module'
import { PermissionModule } from './permission/permission.module'
import { AreaModule } from './area/area.module'
import { UtilsModule } from 'lib/utils'
import { PaymentSessionModule } from './paymentSession/paymentSession.module'
import { ReceiptSessionModule } from './receiptSession/receiptSession.module'
import { ClubFeeModule } from './clubFee/clubFee.module'
import { LogModule } from './log/log.module'
import { PlaceModule } from './place/place.module'
import { APP_GUARD } from '@nestjs/core'
import { AthenticatedGuard } from './auth/guard/authenticated.guard'
import { ScheduleModule } from '@nestjs/schedule'
import { SessionModule } from './session/session.module'
import { ExcelModule } from './excel/excel.module'

// const cwd = process.cwd();

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    // In-memoryDB
    InMemoryDBModule.forRoot({}),
    // TypeOrm
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: configService.get('MYSQL_PORT'),
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: false,
        namingStrategy: new SnakeNamingStrategy(),
        timezone: 'local',
      }),
      inject: [ConfigService],
    }),
    //ScheduleModule
    ScheduleModule.forRoot(),
    // // Redis
    // CacheModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     store: redisStore,
    //     ttl: configService.get('REDIS_CACHE_TTL'),
    //     host: configService.get('REDIS_HOST'),
    //     port: configService.get('REDIS_PORT'),
    //     isGlobal: true,
    //   }),
    //   isGlobal: true,
    //   inject: [ConfigService],
    // }),
    // // ElasticSearch
    // ElasticsearchModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     node: configService.get('ELASTICSEARCH_NODE'),
    //     auth: {
    //       username: configService.get('ELASTICSEARCH_USERNAME'),
    //       password: configService.get('ELASTICSEARCH_PASSWORD'),
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
    // // Bull Queues
    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     redis: {
    //       host: configService.get('REDIS_HOST'),
    //       port: configService.get('REDIS_PORT'),
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
    // Module
    UtilsModule,
    HttpModule,
    UserModule,
    MemberModule,
    GuestModule,
    EventModule,
    PaymentModule,
    ReceiptModule,
    AuthModule,
    ClubModule,
    PermissionModule,
    AreaModule,
    PaymentSessionModule,
    ReceiptSessionModule,
    ClubFeeModule,
    LogModule,
    PlaceModule,
    SessionModule,
    ExcelModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AthenticatedGuard,
    },
  ],
})
export class AppModule { }
