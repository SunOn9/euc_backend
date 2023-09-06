import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  CustomRpcExceptionFilter,
  HttpExceptionFilter,
} from './exception.filter';

async function bootstrap() {
  //grpc service
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: ['fadovn_store'],
        loader: {
          longs: String,
          enums: String,
          json: true,
          defaults: true,
        },
        protoPath: [join(__dirname, '../../proto/api.proto')],
      },
      logger: ['error', 'warn', 'debug', 'verbose'],
    },
  );
  await grpcApp.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  grpcApp.useGlobalFilters(new CustomRpcExceptionFilter());

  await grpcApp.listen();

  //http service
  const httpApp = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose'],
  });
  httpApp.enableCors({
    credentials: true,
  });
  httpApp.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );
  httpApp.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('EUC')
    .setDescription('EUC')
    .setVersion('1.0')
    .addTag('euc')
    .build();
  const document = SwaggerModule.createDocument(httpApp, config);
  SwaggerModule.setup('api', httpApp, document);

  await httpApp.listen(3001);
  console.log(`Application is running on: ${await httpApp.getUrl()}`);
}

bootstrap();
