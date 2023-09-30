import { NestFactory, Reflector } from '@nestjs/core'
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { join } from 'path';
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import {
  // CustomRpcExceptionFilter,
  HttpExceptionFilter,
} from './exception.filter'

import * as passport from 'passport'
import * as session from 'express-session'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  //grpc service
  // const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.GRPC,
  //     options: {
  //       package: ['euc_backend'],
  //       loader: {
  //         longs: String,
  //         enums: String,
  //         json: true,
  //         defaults: true,
  //       },
  //       protoPath: [join(__dirname, '../../proto/api.proto')],
  //     },
  //     logger: ['error', 'warn', 'debug', 'verbose'],
  //   },
  // );
  // await grpcApp.useGlobalPipes(
  //   new ValidationPipe({ whitelist: true, transform: true }),
  // );

  // grpcApp.useGlobalFilters(new CustomRpcExceptionFilter());

  // await grpcApp.listen();

  //http service
  const httpApp = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose'],
  })

  const configService = httpApp.get(ConfigService)

  const oneMonth = 30 * 24 * 60 * 60 * 1000
  httpApp.use(
    session({
      secret: configService.get('SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: oneMonth },
    }),
  )
  httpApp.use(passport.initialize())
  httpApp.use(passport.session())

  httpApp.enableShutdownHooks()

  httpApp.enableCors({
    credentials: true,
  })
  httpApp.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  )
  httpApp.useGlobalFilters(new HttpExceptionFilter())
  const config = new DocumentBuilder()
    .setTitle('EUC')
    .setDescription('EUC')
    .setVersion('1.0')
    .addTag('euc')
    .build()
  const document = SwaggerModule.createDocument(httpApp, config)
  SwaggerModule.setup('api', httpApp, document)

  await httpApp.listen(configService.get('HTTP_PORT'))
  console.log(`Application is running on: ${await httpApp.getUrl()}`)
}

bootstrap()
