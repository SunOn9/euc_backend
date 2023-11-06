import { NestFactory } from '@nestjs/core'

import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './exception.filter'

import * as session from 'express-session'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  //http service
  const httpApp = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose'],
  })

  const configService = httpApp.get(ConfigService)

  httpApp.use(
    session({
      secret: configService.get('SECRET'),
      resave: false,
      saveUninitialized: false,
    }),
  )

  httpApp.enableShutdownHooks()

  httpApp.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
  httpApp.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  )
  httpApp.useGlobalFilters(new HttpExceptionFilter())

  const config = new DocumentBuilder()
    .setTitle('EUC')
    .setDescription('Only for developer')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(httpApp, config)
  SwaggerModule.setup('api', httpApp, document)

  await httpApp.listen(configService.get('HTTP_PORT'))
  console.log(`Application is running on: ${await httpApp.getUrl()}`)
}

bootstrap()
