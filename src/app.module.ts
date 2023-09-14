import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
// import { ElasticsearchModule } from '@nestjs/elasticsearch';
// import { BullModule } from '@nestjs/bull';
// import { CacheModule } from '@nestjs/cache-manager';
// import * as redisStore from 'cache-manager-redis-store';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ReceiptModule } from './receipt/receipt.module';
import { PaymentModule } from './payment/payment.module';
import { EventModule } from './event/event.module';
import { GuestModule } from './guest/guest.module';
import { MemberModule } from './member/member.module';
import { ClubModule } from './club/club.module';
import { PermissionModule } from './permission/permission.module';
import { AreaModule } from './area/area.module';
import { UtilsModule } from 'lib/utils';
import { PaymentSessionModule } from './payment-session/payment-session.module';
import { ReceiptSessionModule } from './receipt-session/receipt-session.module';
import { MemberInClubModule } from './member-in-club/member-in-club.module';
import { ClubFeeModule } from './club-fee/club-fee.module';
import { LogModule } from './log/log.module';

// const cwd = process.cwd();

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
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
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
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
    MemberInClubModule,
    ClubFeeModule,
    LogModule,
  ],
  providers: [],
})
export class AppModule {}
