import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:4200'],
  });

  const config = new DocumentBuilder()
    .setTitle('Extreme Power')
    .setDescription('An api to handle business needs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('port');

  await app.listen(PORT);
}

bootstrap();
